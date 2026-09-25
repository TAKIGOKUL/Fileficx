import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

beforeAll(() => {
  if (typeof window !== 'undefined') {
    window.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    window.URL.revokeObjectURL = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  }
});

describe('App Component', () => {
  it('renders hero headline and smart parser', () => {
    render(<App />);
    expect(screen.getByText(/Make every file/i)).toBeDefined();
    expect(screen.getByText(/application ready\./i)).toBeDefined();
    expect(screen.getByText(/Paste the requirement\. Drop the file\. Done\./i)).toBeDefined();
  });

  it('displays client-side privacy guarantee badge', () => {
    render(<App />);
    expect(screen.getAllByText(/No files are uploaded to any server/i).length).toBeGreaterThan(0);
  });

  it('attaches file on drop/select and proceeds to workspace only when Process button is clicked', () => {
    render(<App />);
    
    // Initially hero and dropzone are present, no "Try Another File" in navbar
    expect(screen.getByText(/Drop files here or click to upload/i)).toBeDefined();
    expect(screen.queryByText(/Try Another File/i)).toBeNull();

    // Simulate file upload
    const file = new File(['fake content'], 'test_photo.jpg', { type: 'image/jpeg' });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).toBeDefined();

    fireEvent.change(fileInput, { target: { files: [file] } });

    // After upload: Hero section and Dropzone remain visible! File is attached, and Parse button turns into "Process Now →"
    expect(screen.getByText(/File Attached:/i)).toBeDefined();
    const processBtn = screen.getByText(/Process Now →/i);
    expect(processBtn).toBeDefined();

    // Clicking "Process Now →" proceeds to the 2-Pane Workspace
    fireEvent.click(processBtn);

    expect(screen.getByText(/PANE 1 · ORIGINAL FILE PREVIEW/i)).toBeDefined();
    expect(screen.getByText(/PANE 2 · MODIFIED FILE/i)).toBeDefined();

    // "Try Another File" button is present on the navbar
    const tryAnotherBtn = screen.getByText(/Try Another File/i);
    expect(tryAnotherBtn).toBeDefined();

    // Clicking "Try Another File" returns to upload & hero view
    fireEvent.click(tryAnotherBtn);
    expect(screen.getByText(/Make every file/i)).toBeDefined();
    expect(screen.getByText(/Drop files here or click to upload/i)).toBeDefined();
    expect(screen.queryByText(/PANE 1 · ORIGINAL FILE PREVIEW/i)).toBeNull();
  });

  it('renders side vertical ads and bottom banner, and has no top banner', () => {
    const { container } = render(<App />);
    
    // Top banner should NOT exist
    const topBanner = container.querySelector('.ad-slot.ad-top');
    expect(topBanner).toBeNull();

    // Side vertical skyscraper ads (left and right)
    const sideLeft = container.querySelector('.ad-slot[data-ad-slot="side-left"]');
    const sideRight = container.querySelector('.ad-slot[data-ad-slot="side-right"]');
    expect(sideLeft).not.toBeNull();
    expect(sideRight).not.toBeNull();

    // Bottom banner
    const bottomBanner = container.querySelector('.ad-slot.ad-bottom[data-ad-slot="bottom-banner"]');
    expect(bottomBanner).not.toBeNull();
  });

  it('renders sidebar ad slot inside workspace when file is loaded and processed', () => {
    const { container } = render(<App />);
    const file = new File(['fake content'], 'test_signature.png', { type: 'image/png' });
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [file] } });

    const processBtn = screen.getByText(/Process Now →/i);
    fireEvent.click(processBtn);

    // Sidebar banner
    const sidebarBanner = container.querySelector('.ad-slot.ad-sidebar[data-ad-slot="sidebar"]');
    expect(sidebarBanner).not.toBeNull();
  });

  it('allows dropping a file anywhere on the window and proceeding upon Parse click', () => {
    render(<App />);
    
    const file = new File(['global drop content'], 'global_photo.jpg', { type: 'image/jpeg' });
    
    // Trigger drop event on window
    fireEvent.drop(window, {
      dataTransfer: {
        files: [file]
      }
    });

    // File is attached, user clicks Process Now
    const processBtn = screen.getByText(/Process Now →/i);
    expect(processBtn).toBeDefined();
    fireEvent.click(processBtn);

    // 2-Pane Workspace is displayed after proceeding
    expect(screen.getByText(/PANE 1 · ORIGINAL FILE PREVIEW/i)).toBeDefined();
    expect(screen.getByText(/Try Another File/i)).toBeDefined();
  });
});
