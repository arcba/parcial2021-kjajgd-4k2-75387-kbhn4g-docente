import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDialogService } from '../../services/modal-dialog.service';
import { Proveedor } from '../../models/proveedor';
import { ProveedoresService } from '../../services/proveedores.service';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit {
  Titulo = 'Proveedores';
  TituloAccionABMC = {
    A: '(Agregar)',
    B: '(Eliminar)',
    M: '(Modificar)',
    C: '(Consultar)',
    L: '(Listado)'
  };
  AccionABMC = 'L'; // inicialmente inicia en el listado de articulos (buscar con parametros)
  Mensajes = {
    SD: ' No se encontraron registros...',
    RD: ' Revisar los datos ingresados...'
  };

  Items: Proveedor[] = null;
  submitted: boolean = false;

  FormRegistro: FormGroup;
  FormBusqueda: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    private modalDialogService: ModalDialogService,
    private proveedoresService: ProveedoresService
  ) {}

  ngOnInit() {
    this.FormBusqueda = this.formBuilder.group({
      ProveedorRazonSocial: [null]
    });
    this.FormRegistro = this.formBuilder.group({
      PoveedorId: [null],
      ProveedorRazonSocial: [
        null,
        [Validators.required, Validators.minLength(5), Validators.maxLength(50)]
      ],
      ProveedorCodigo: [
        null,
        [Validators.required, Validators.pattern('^\\d{1,13}$')]
      ],
      ProveedorFecha: [
        null,
        [
          Validators.required,
          Validators.pattern(
            '(0[1-9]|[12][0-9]|3[01])[-/](0[1-9]|1[012])[-/](19|20)[0-9]{2}'
          )
        ]
      ]
    });
  }

  Agregar() {
    this.AccionABMC = 'A';
    this.FormRegistro.reset({ PoveedorId: 0 });
    this.submitted = false;
    this.FormRegistro.markAsUntouched();
  }

  Buscar() {
    //this.modalDialogService.BloquearPantalla();
    this.proveedoresService
      .get()
      //this.articulosService.get("", null, this.Pagina)
      .subscribe((res: any) => {
        this.Items = res;
        //this.modalDialogService.DesbloquearPantalla();
      });
  }

  // grabar tanto altas como modificaciones
  Grabar() {
    this.submitted = true;
    if (this.FormRegistro.invalid) {
      return;
    }

    //hacemos una copia de los datos del formulario, para modificar la fecha y luego enviarlo al servidor
    const itemCopy = { ...this.FormRegistro.value };

    //convertir fecha de string dd/MM/yyyy a ISO para que la entienda webapi
    var arrFecha = itemCopy.ProveedorFecha.substr(0, 10).split('/');
    if (arrFecha.length == 3)
      itemCopy.ProveedorFecha = new Date(
        arrFecha[2],
        arrFecha[1] - 1,
        arrFecha[0]
      ).toISOString();

    // agregar post
    if (this.AccionABMC == 'A') {
      //this.modalDialogService.BloquearPantalla();
      this.proveedoresService.post(itemCopy).subscribe((res: any) => {
        this.Volver();
        this.modalDialogService.Alert('Registro agregado correctamente.');
        this.Buscar();
        //this.modalDialogService.DesbloquearPantalla();
      });
    }
  }

  // Volver desde Agregar/Modificar
  Volver() {
    this.AccionABMC = 'L';
  }

  ImprimirListado() {
    this.modalDialogService.Alert('Sin desarrollar...');
  }
}
