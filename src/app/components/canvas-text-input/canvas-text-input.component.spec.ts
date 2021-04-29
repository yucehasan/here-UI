import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasTextInputComponent } from './canvas-text-input.component';

describe('CanvasTextInputComponent', () => {
  let component: CanvasTextInputComponent;
  let fixture: ComponentFixture<CanvasTextInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanvasTextInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasTextInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
