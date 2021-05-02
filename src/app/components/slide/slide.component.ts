import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Injectable,
  Output,
  EventEmitter,
  Input,
  OnInit,
} from '@angular/core';
import WebViewer, { Actions, WebViewerInstance } from '@pdftron/webviewer';
import { Action } from 'rxjs/internal/scheduler/Action';
import { FileService } from 'src/app/services/file.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-slide',
  templateUrl: './slide.component.html',
  styleUrls: ['./slide.component.sass'],
})
export class SlideComponent implements OnInit, AfterViewInit {
  @ViewChild('viewer') viewer: ElementRef;
  @Input('slideb64') slideb64: string;
  @Input() next: EventEmitter<void>;
  @Input() prev: EventEmitter<void>;
  @Output() onChange = new EventEmitter<number>();
  wvInstance: WebViewerInstance;
  nextButton: HTMLButtonElement;
  prevButton: HTMLButtonElement;
  currentSlide: number;

  constructor(){}

  base64ToBlob(base64) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; ++i) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new Blob([bytes], { type: 'application/pdf' });
  }

  ngOnInit() {
    this.wvDocumentLoadedHandler = this.wvDocumentLoadedHandler.bind(this);
  }

  ngAfterViewInit(): void {
    WebViewer(
      {
        path: '../../../assets/lib',
      },
      this.viewer.nativeElement
    ).then((instance) => {
      instance.loadDocument(this.base64ToBlob(this.slideb64), {
        filename: 'mypdf.pdf',
      });

      this.wvInstance = instance;
      this.currentSlide = instance.docViewer.getCurrentPage();
      instance.disableElements([
        'header',
        'notesPanel',
        'textPopup',
        'contextMenuPopup',
        'toolsHeader',
      ]);
      instance.disableFeatures(['PageNavigation']);

      // now you can access APIs through this.webviewer.getInstance()
      // see https://www.pdftron.com/documentation/web/guides/ui/apis for the full list of APIs

      // or listen to events from the viewer element
      this.viewer.nativeElement.addEventListener('pageChanged', (e) => {
        const [pageNumber] = e.detail;
        this.onChange.emit(pageNumber);
      });

      // or from the docViewer instance
      // instance.docViewer.on('annotationsLoaded', () => {
      //   console.log('annotations loaded');
      // });

      instance.docViewer.on('documentLoaded', this.wvDocumentLoadedHandler);

      var element = document.querySelector("iframe").contentWindow.document.getElementsByClassName("PageNavOverlay");
      (element[0] as HTMLElement).style.display = 'none';

      var element = document.querySelector("iframe").contentWindow.document.getElementsByClassName("side-arrow-container");
      this.prevButton = element[0] as HTMLButtonElement;
      this.nextButton = element[1] as HTMLButtonElement;
    });
  }

  changeSlide(number) {
    this.wvInstance.docViewer.setCurrentPage(number);
  }

  nextSlide(){
    this.nextButton.click();
  }

  prevSlide(){
    this.prevButton.click();
  }

  wvDocumentLoadedHandler(): void {
    // you can access docViewer object for low-level APIs
    // and access classes defined in the WebViewer iframe
    const { Annotations, annotManager, docViewer } = this.wvInstance;
    // see https://www.pdftron.com/api/web/WebViewer.html for the full list of low-level APIs
  }
}
