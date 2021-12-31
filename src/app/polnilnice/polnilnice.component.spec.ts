import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolnilniceComponent } from './polnilnice.component';

describe('PolnilniceComponent', () => {
  let component: PolnilniceComponent;
  let fixture: ComponentFixture<PolnilniceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolnilniceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolnilniceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
