import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-note-canvas',
  templateUrl: './note-canvas.component.html',
  styleUrls: ['./note-canvas.component.sass'],
})
export class NoteCanvasComponent implements OnInit {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  canvasWidth: number;
  canvasHeight: number;
  flag: boolean;

  prevX: number;
  currX: number;
  prevY: number;
  currY: number;

  dot_flag: boolean;
  brushColor: string;
  brushWidth: number;

  active: boolean;
  currentX: number;
  currentY: number;
  initialX: number;
  initialY: number;
  xOffset: number;
  yOffset: number;

  filterData;

  constructor(
    public dialogRef: MatDialogRef<NoteCanvasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.setPosition();
    this.initCanvas();
    this.draw2();
  }

  setPosition(): void {
    this.filterData = this.data;
    const leftMosPos = Number(this.filterData.right);
    console.log(this.filterData);
    this.dialogRef.updatePosition({
      bottom: `${this.filterData.top}px`,
      left: `${leftMosPos}px`,
    });
  }

  snip() {
    var video = this.data.getSnip();
    console.log('in note canvas', video);
    this.canvas
      .getContext('2d')
      .drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
  }

  initCanvas(): void {
    this.canvas = document.getElementById('can') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.canvasWidth = this.canvas.width;
    this.canvasHeight = this.canvas.height;
    this.flag = false;
    this.dot_flag = false;
    this.prevX = 0;
    this.currX = 0;
    this.prevY = 0;
    this.currY = 0;
    (this.brushColor = 'black'), (this.brushWidth = 2);
    document
      .getElementById(this.brushColor)
      .style.setProperty('border', 'solid 3px aquamarine');
    this.active = false;
    this.xOffset = 0;
    this.yOffset = 0;
  }

  close(): void {
    this.dialogRef.close();
  }

  draw2() {
    this.canvas.addEventListener(
      'mousemove',
      (e) => {
        this.findxy('move', e);
      },
      false
    );
    this.canvas.addEventListener(
      'mousedown',
      (e) => {
        this.findxy('down', e);
      },
      false
    );
    this.canvas.addEventListener(
      'mouseup',
      (e) => {
        this.findxy('up', e);
      },
      false
    );
    this.canvas.addEventListener(
      'mouseout',
      (e) => {
        this.findxy('out', e);
      },
      false
    );
  }

  color(obj) {
    var selected = document.getElementById(this.brushColor);
    selected.style.setProperty('border', '0');
    console.log(obj);
    switch (obj.srcElement.id) {
      case 'green':
        this.brushColor = 'green';
        break;
      case 'blue':
        this.brushColor = 'blue';
        break;
      case 'red':
        this.brushColor = 'red';
        break;
      case 'yellow':
        this.brushColor = 'yellow';
        break;
      case 'orange':
        this.brushColor = 'orange';
        break;
      case 'black':
        this.brushColor = 'black';
        break;
      case 'white':
        this.brushColor = 'white';
        break;
    }
    if (this.brushColor == 'white') this.brushWidth = 14;
    else this.brushWidth = 2;

    selected = document.getElementById(this.brushColor);
    if (this.brushColor === 'black')
      selected.style.setProperty('border', 'solid 3px aquamarine');
    else selected.style.setProperty('border', 'solid 3px black');
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.moveTo(this.prevX, this.prevY);
    this.ctx.lineTo(this.currX, this.currY);
    this.ctx.strokeStyle = this.brushColor;
    this.ctx.lineWidth = this.brushWidth;
    this.ctx.stroke();
    this.ctx.closePath();
  }

  erase() {
    var m = confirm('Want to clear');
    if (m) {
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      document.getElementById('canvasimg').style.display = 'none';
    }
  }

  save() {
    var canvasimg = document.getElementById('canvasimg') as HTMLImageElement;
    canvasimg.style.border = '2px solid';
    canvasimg.src = this.canvas.toDataURL();
    canvasimg.style.display = 'inline';
  }

  addtext() {
    this.canvas.addEventListener(
      'click',
      (e) => {
        this.text(e);
      },
      { once: true }
    );
  }

  text(e) {
    this.ctx = this.canvas.getContext('2d');
    this.ctx.fillText(
      'hello',
      e.clientX - this.canvas.offsetLeft,
      e.clientY - this.canvas.offsetTop
    );
  }

  findxy(res, e) {
    if (res == 'down') {
      this.prevX = this.currX;
      this.prevY = this.currY;
      this.currX = e.clientX - this.canvas.offsetLeft;
      this.currY = e.clientY - this.canvas.offsetTop;

      this.flag = true;
      this.dot_flag = true;
      if (this.dot_flag) {
        this.ctx.beginPath();
        this.ctx.fillStyle = this.brushColor;
        this.ctx.fillRect(this.currX, this.currY, 2, 2);
        this.ctx.closePath();
        this.dot_flag = false;
      }
    }
    if (res == 'up' || res == 'out') {
      this.flag = false;
    }
    if (res == 'move') {
      if (this.flag) {
        this.prevX = this.currX;
        this.prevY = this.currY;
        this.currX = e.clientX - this.canvas.offsetLeft;
        this.currY = e.clientY - this.canvas.offsetTop;
        this.draw();
      }
    }
  }

  dragStart(x, e) {
    if (e.type === 'touchstart') {
      this.initialX = e.touches[0].clientX - this.xOffset;
      this.initialY = e.touches[0].clientY - this.yOffset;
    } else {
      this.initialX = e.clientX - this.xOffset;
      this.initialY = e.clientY - this.yOffset;
    }

    if (e.target === x) {
      this.active = true;
    }
  }

  dragEnd(x, e) {
    this.initialX = this.currentX;
    this.initialY = this.currentY;

    this.active = false;
  }

  drag(x, e) {
    if (this.active) {
      e.preventDefault();

      if (e.type === 'touchmove') {
        this.currentX = e.touches[0].clientX - this.initialX;
        this.currentY = e.touches[0].clientY - this.initialY;
      } else {
        this.currentX = e.clientX - this.initialX;
        this.currentY = e.clientY - this.initialY;
      }

      this.xOffset = this.currentX;
      this.yOffset = this.currentY;

      this.setTranslate(this.currentX, this.currentY, x);
    }
  }

  setTranslate(xPos, yPos, el) {
    el.style.transform = 'translate3d(' + xPos + 'px, ' + yPos + 'px, 0)';
  }
}
