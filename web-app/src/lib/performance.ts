// Performance monitoring and optimization utilities for SKTCH

export interface PerformanceMetrics {
  // Core Web Vitals
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  
  // Additional metrics
  fcp?: number; // First Contentful Paint
  ttfb?: number; // Time to First Byte
  
  // Custom metrics
  timeToInteractive?: number;
  voiceControlReady?: number;
  
  // Page info
  url: string;
  timestamp: number;
}

export class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    url: typeof window !== 'undefined' ? window.location.href : '',
    timestamp: Date.now()
  };

  private observer?: PerformanceObserver;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeObservers();
      this.measureCustomMetrics();
    }
  }

  private initializeObservers() {
    // Observe Core Web Vitals
    try {
      // LCP Observer
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry;
        this.metrics.lcp = lastEntry.startTime;
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // FID Observer
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.metrics.fid = entry.processingStart - entry.startTime;
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // CLS Observer
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        let clsValue = 0;
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        this.metrics.cls = clsValue;
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // Navigation timing
      const navObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.metrics.fcp = entry.firstContentfulPaint;
          this.metrics.ttfb = entry.responseStart - entry.requestStart;
        });
      });
      navObserver.observe({ entryTypes: ['navigation'] });

      this.observer = lcpObserver; // Keep reference for cleanup
    } catch (error) {
      console.warn('Performance observers not supported:', error);
    }
  }

  private measureCustomMetrics() {
    // Measure time to interactive
    const measureTTI = () => {
      if (document.readyState === 'interactive' || document.readyState === 'complete') {
        this.metrics.timeToInteractive = performance.now();
      } else {
        document.addEventListener('DOMContentLoaded', () => {
          this.metrics.timeToInteractive = performance.now();
        });
      }
    };

    measureTTI();

    // Measure voice control readiness
    this.measureVoiceControlReady();
  }

  public measureVoiceControlReady() {
    const startTime = performance.now();
    
    // Check for voice control prerequisites
    const checkVoiceReady = async () => {
      try {
        // Check microphone access
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        
        // Check if SKTCH components are loaded
        const hudElement = document.querySelector('.pulse-hud');
        const voiceComponents = document.querySelector('[data-sktch-voice]');
        
        if (hudElement || voiceComponents) {
          this.metrics.voiceControlReady = performance.now() - startTime;
          this.reportMetric('voice_control_ready', this.metrics.voiceControlReady);
        }
      } catch (error) {
        console.warn('Voice control readiness check failed:', error);
      }
    };

    // Check after a short delay to allow components to mount
    setTimeout(checkVoiceReady, 100);
  }

  public measureInteraction(name: string, startTime?: number) {
    const endTime = performance.now();
    const duration = startTime ? endTime - startTime : endTime;
    
    this.reportMetric(`interaction_${name}`, duration);
    return duration;
  }

  public reportMetric(name: string, value: number) {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 Performance: ${name} = ${value.toFixed(2)}ms`);
    }

    // Send to analytics service
    this.sendToAnalytics(name, value);
  }

  private sendToAnalytics(name: string, value: number) {
    // Send to your analytics service
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'performance_metric', {
        metric_name: name,
        metric_value: Math.round(value),
        page_url: this.metrics.url
      });
    }

    // Also send to custom endpoint
    fetch('/api/analytics/performance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        metric: name,
        value: Math.round(value),
        url: this.metrics.url,
        timestamp: Date.now(),
        userAgent: navigator.userAgent
      })
    }).catch(err => {
      console.warn('Failed to send performance metric:', err);
    });
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public reportAllMetrics() {
    // Wait for page to be fully loaded
    if (document.readyState === 'complete') {
      this.sendMetrics();
    } else {
      window.addEventListener('load', () => {
        setTimeout(() => this.sendMetrics(), 1000); // Wait 1s after load
      });
    }
  }

  private sendMetrics() {
    const finalMetrics = this.getMetrics();
    
    // Calculate scores
    const scores = this.calculateScores(finalMetrics);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Final Performance Metrics:', finalMetrics);
      console.log('🎯 Performance Scores:', scores);
    }

    // Send to analytics
    fetch('/api/analytics/performance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'page_metrics',
        metrics: finalMetrics,
        scores,
        timestamp: Date.now()
      })
    }).catch(err => {
      console.warn('Failed to send performance metrics:', err);
    });
  }

  private calculateScores(metrics: PerformanceMetrics) {
    const scores = {
      lcp: this.scoreLCP(metrics.lcp),
      fid: this.scoreFID(metrics.fid),
      cls: this.scoreCLS(metrics.cls),
      overall: 0
    };

    // Calculate overall score (average of available scores)
    const validScores = Object.values(scores).filter(score => score > 0);
    scores.overall = validScores.length > 0 
      ? Math.round(validScores.reduce((sum, score) => sum + score, 0) / validScores.length)
      : 0;

    return scores;
  }

  private scoreLCP(lcp?: number): number {
    if (!lcp) return 0;
    if (lcp <= 2500) return 100; // Good
    if (lcp <= 4000) return 75;  // Needs improvement
    return 50; // Poor
  }

  private scoreFID(fid?: number): number {
    if (!fid) return 0;
    if (fid <= 100) return 100; // Good
    if (fid <= 300) return 75;  // Needs improvement
    return 50; // Poor
  }

  private scoreCLS(cls?: number): number {
    if (cls === undefined) return 0;
    if (cls <= 0.1) return 100; // Good
    if (cls <= 0.25) return 75; // Needs improvement
    return 50; // Poor
  }

  public cleanup() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// Utility functions for performance optimization

export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

export function preloadImages(srcs: string[]): Promise<void[]> {
  return Promise.all(srcs.map(preloadImage));
}

export function measureAsync<T>(
  name: string,
  asyncFunction: () => Promise<T>
): Promise<T> {
  const startTime = performance.now();
  
  return asyncFunction().finally(() => {
    const duration = performance.now() - startTime;
    console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
  });
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Hook for React components
export function usePerformanceMonitor() {
  if (typeof window !== 'undefined') {
    const monitor = new PerformanceMonitor();
    
    // Report metrics when component unmounts or page unloads
    window.addEventListener('beforeunload', () => {
      monitor.reportAllMetrics();
    });

    return monitor;
  }
  
  return null;
}

// Global performance monitor instance
export const performanceMonitor = typeof window !== 'undefined' 
  ? new PerformanceMonitor() 
  : null;

// Auto-report metrics after page load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      performanceMonitor?.reportAllMetrics();
    }, 2000); // Wait 2 seconds after load for all metrics to be captured
  });
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}