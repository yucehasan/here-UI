import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteCanvasComponent } from './note-canvas.component';

describe('NoteCanvasComponent', () => {
  let component: NoteCanvasComponent;
  let fixture: ComponentFixture<NoteCanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoteCanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
