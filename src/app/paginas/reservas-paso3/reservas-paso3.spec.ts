import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservasPaso3 } from './reservas-paso3';

describe('ReservasPaso3', () => {
  let component: ReservasPaso3;
  let fixture: ComponentFixture<ReservasPaso3>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservasPaso3]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservasPaso3);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
