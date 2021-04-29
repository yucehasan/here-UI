import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedNotesComponent } from './saved-notes.component';

describe('SavedNotesComponent', () => {
  let component: SavedNotesComponent;
  let fixture: ComponentFixture<SavedNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavedNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
