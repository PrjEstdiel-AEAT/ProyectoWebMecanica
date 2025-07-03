import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservasPaso1 } from './reservas-paso1';

describe('ReservasPaso1', () => {
  let component: ReservasPaso1;
  let fixture: ComponentFixture<ReservasPaso1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservasPaso1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservasPaso1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
