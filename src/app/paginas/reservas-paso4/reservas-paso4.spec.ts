import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservasPaso4 } from './reservas-paso4';

describe('ReservasPaso4', () => {
  let component: ReservasPaso4;
  let fixture: ComponentFixture<ReservasPaso4>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservasPaso4]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservasPaso4);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
