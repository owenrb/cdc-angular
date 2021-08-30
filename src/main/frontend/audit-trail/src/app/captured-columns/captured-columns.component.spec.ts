import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapturedColumnsComponent } from './captured-columns.component';

describe('CapturedColumnsComponent', () => {
  let component: CapturedColumnsComponent;
  let fixture: ComponentFixture<CapturedColumnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CapturedColumnsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CapturedColumnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
