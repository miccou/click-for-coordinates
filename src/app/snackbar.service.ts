import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor() {}

  updateInterval!: any;
  snackbar!: HTMLDivElement;

  show(message: string, type: 'success' | 'info' | 'warn' | 'error'): void {
    let panelClass = '';
    let progressClass = '';

    switch (type) {
      case 'success':
        panelClass = 'bg-green-500';
        progressClass = 'bg-green-400';
        break;
      case 'info':
        panelClass = 'bg-blue-500';
        progressClass = 'bg-blue-400';
        break;
      case 'warn':
        panelClass = 'bg-yellow-500';
        progressClass = 'bg-yellow-400';
        break;
      case 'error':
        panelClass = 'bg-red-500';
        progressClass = 'bg-red-400';
        break;
      default:
        break;
    }

    this.snackbar = document.createElement('div');
    this.snackbar.classList.add(
      'absolute',
      'bottom-4',
      'left-1/2',
      'transform',
      '-translate-x-1/2',
      'z-10000',
      'p-0',
      'flex',
      'flex-col',
      'items-center',
      'rounded-md',
      'shadow-md',
      'text-white',
      'font-medium',
      'overflow-hidden',
      panelClass
    );

    document.body.appendChild(this.snackbar);

    let iter = 0;

    this.updateInterval = setInterval(() => {
      iter++;
      if (iter > 100) {
        this.remove();
      }

      this.snackbar.innerHTML = `<span class="p-2">${message}</span>
      <div class="w-full ${progressClass} rounded-bottom h-0.5">
        <div class="h-0.5 bg-gray-200 rounded-bottom" style="width: ${iter}%"></div>
      </div>`;
    }, 50);
  }

  remove() {
    clearInterval(this.updateInterval);
    this.snackbar.remove();
  }
}
