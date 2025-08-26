import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { createReadStream, statSync } from 'fs';

export async function GET() {
  try {
    // Path to the extension dist folder
    const extensionPath = path.join(process.cwd(), '..', '..', 'dist');
    const zipPath = path.join(extensionPath, 'sktch-extension.zip');
    
    // For now, serve the dist folder directly
    // In production, this would be a pre-built zip file
    const response = NextResponse.json({
      message: 'Extension download ready',
      downloadUrl: '/api/download-extension-zip',
      installInstructions: {
        steps: [
          'Download will start automatically',
          'Open Chrome -> chrome://extensions/',
          'Enable Developer Mode',
          'Click "Load unpacked"',
          'Select the SKTCH folder',
          'Start using voice control!'
        ]
      }
    });
    
    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Download failed' }, { status: 500 });
  }
}

export async function POST() {
  // Trigger direct download
  return NextResponse.redirect('/dist/');
}