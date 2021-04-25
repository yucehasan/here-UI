import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaComponent } from './ta.component';

describe('TaComponent', () => {
  let component: TaComponent;
  let fixture: ComponentFixture<TaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
