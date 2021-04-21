import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Injectable,
  Output,
  EventEmitter,
} from '@angular/core';
import WebViewer, { Actions } from '@pdftron/webviewer';
import { Action } from 'rxjs/internal/scheduler/Action';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-slide',
  templateUrl: './slide.component.html',
  styleUrls: ['./slide.component.sass'],
})
export class SlideComponent implements AfterViewInit {
  @ViewChild('viewer') viewer: ElementRef;
  @Output() onChange = new EventEmitter<number>();
  wvInstance: any;

  base64ToBlob(base64) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; ++i) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return new Blob([bytes], { type: 'application/pdf' });
  }

  ngAfterViewInit(): void {
    WebViewer(
      {
        path: '../../../assets/lib',
        initialDoc: 'https://dergipark.org.tr/tr/download/article-file/636381',
      },
      this.viewer.nativeElement
    ).then((instance) => {
      // instance.loadDocument(this.base64ToBlob(environment.pdf), {
      //   filename: 'mypdf.pdf',
      // });

      this.wvInstance = instance;

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
        console.log(`Current page is ${pageNumber}`);
        this.onChange.emit(pageNumber);
      });

      // or from the docViewer instance
      instance.docViewer.on('annotationsLoaded', () => {
        console.log('annotations loaded');
      });

      instance.docViewer.on('documentLoaded', this.wvDocumentLoadedHandler);
    });
  }

  ngOnInit() {
    this.wvDocumentLoadedHandler = this.wvDocumentLoadedHandler.bind(this);
  }

  wvDocumentLoadedHandler(): void {
    // you can access docViewer object for low-level APIs
    // and access classes defined in the WebViewer iframe
    const { Annotations, annotManager, docViewer } = this.wvInstance;

    console.log('asdnf ', docViewer.displayPageLocation(3));
    // see https://www.pdftron.com/api/web/WebViewer.html for the full list of low-level APIs
  }
}
