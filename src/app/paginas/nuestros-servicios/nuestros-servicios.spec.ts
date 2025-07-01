import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuestrosServicios } from './nuestros-servicios';

describe('NuestrosServicios', () => {
  let component: NuestrosServicios;
  let fixture: ComponentFixture<NuestrosServicios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuestrosServicios]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuestrosServicios);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
