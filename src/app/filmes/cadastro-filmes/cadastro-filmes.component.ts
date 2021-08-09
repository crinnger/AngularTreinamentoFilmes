import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FilmesService } from 'src/app/core/core/filmes.service';
import { AlertaComponent } from 'src/app/shared/components/alerta/alerta.component';
import { ValidarCamposService } from 'src/app/shared/components/campos/validar-campos.service';
import { Alerta } from 'src/app/shared/models/alerta';
import { Filme } from 'src/app/shared/models/filme';

@Component({
  selector: 'dio-cadastro-filmes',
  templateUrl: './cadastro-filmes.component.html',
  styleUrls: ['./cadastro-filmes.component.scss']
})
export class CadastroFilmesComponent implements OnInit {

  cadastro!: FormGroup;
  generos: Array<string>;
  filme!:Filme;
  id!:number;

  constructor(public validacao:ValidarCamposService,
              public dialog:MatDialog,
              private filmeService:FilmesService,
              private fb: FormBuilder,
              private activatedRoute:ActivatedRoute,
              private router:Router ) {
    this.generos=['Açao','Romance','Terror','Aventura','Comedia','Drama','Sci-Fi'];
   }

  ngOnInit(): void {
    this.id=this.activatedRoute.snapshot.params['id'];
    if(this.id){
      this.filmeService.visualizar(this.id).subscribe((filme:Filme)=>{
        this.filme=filme;
        this.criarFormulario(this.filme);
        });
    } else {
      this.filme=this.criarFilmeEmBranco();
      this.criarFormulario(this.filme);
    }

  }

  submit(): void {
    this.cadastro.markAllAsTouched();
    if(this.cadastro.invalid){
      return;
    }
    const filme =this.cadastro.getRawValue() as Filme;
    if(this.id){
      filme.id=this.id;
      this.editar(filme);
    } else {
      this.salvar(filme);
    }
  }

  private visualizar(id:number):void{
    this.filmeService.visualizar(id).subscribe((filme:Filme)=>this.filme=filme);
  }

  private editar(filme:Filme):void{
    this.filmeService.editar(filme).subscribe(
      ()=> {
        const config= {
          data : {
            descricao:'Registro Atualizado com sucesso',
            btnSucesso: 'Ir para a Listagem',
            possuirBtnFechar: false
          } as Alerta
        };
        const dialogOk = this.dialog.open(AlertaComponent,config);
        dialogOk.afterClosed().subscribe(()=> this.router.navigateByUrl('filmes'))
        },
      ()=>{
        const config= {
          data : {
            titulo: 'Erro ao Salvar',
            descricao: 'Nao foi possivel salvar',
            btnSucesso: 'Fechar',
            corBtnSucesso:'warn',
            possuirBtnFechar: false
          } as Alerta
        };
        this.dialog.open(AlertaComponent,config);
      }
    );

  }

  private salvar(filme:Filme):void{
    this.filmeService.salvar(filme).subscribe(
      ()=> {
        const config= {
          data : {
            btnSucesso: 'Ir para a Listagem',
            btnCancelar: 'Cadastar novo filme',
            corBtnCancelar: 'primary',
            possuirBtnFechar: true
          } as Alerta
        };
        const dialogOk = this.dialog.open(AlertaComponent,config);
        dialogOk.afterClosed().subscribe((opcao:boolean)=>{
          if(opcao){
            this.router.navigateByUrl('filmes');
          } else {
            this.criarFormulario(this.criarFilmeEmBranco());
          }
        })
        },
      ()=>{
        const config= {
          data : {
            titulo: 'Erro ao Salvar',
            descricao: 'Nao foi possivel salvar',
            btnSucesso: 'Fechar',
            corBtnSucesso:'warn',
            possuirBtnFechar: false
          } as Alerta
        };
        this.dialog.open(AlertaComponent,config);
      }
    );

  }

  reiniciarForm(): void {
    this.cadastro.reset();
  }

  get f(){
    return this.cadastro.controls;
  }

  private criarFormulario(filme: Filme): void {
    this.cadastro = this.fb.group({
      titulo: [filme.titulo, [Validators.required, Validators.minLength(2), Validators.maxLength(256)]],
      urlFoto: [filme.urlFoto, [Validators.minLength(10)]],
      dtLancamento: [filme.dtLancamento, [Validators.required]],
      descricao: [filme.descricao],
      nota: [filme.nota, [Validators.required, Validators.min(0), Validators.max(10)]],
      urlIMDb: [filme.urlIMDb, [Validators.minLength(10)]],
      genero: [filme.genero, [Validators.required]]
    });
  }


  private criarFilmeEmBranco(): Filme {
    return {
      id: undefined,
      titulo: undefined,
      dtLancamento: undefined,
      urlFoto: undefined,
      descricao: undefined,
      nota: undefined,
      urlImdb: undefined,
      genero: undefined
    } as Filme;
  }

}
