import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservasPaso2 } from './reservas-paso2';

describe('ReservasPaso2', () => {
  let component: ReservasPaso2;
  let fixture: ComponentFixture<ReservasPaso2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservasPaso2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservasPaso2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
