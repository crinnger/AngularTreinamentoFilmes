import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FilmesService } from 'src/app/core/core/filmes.service';
import { AlertaComponent } from 'src/app/shared/components/alerta/alerta.component';
import { Alerta } from 'src/app/shared/models/alerta';
import { Filme } from 'src/app/shared/models/filme';

@Component({
  selector: 'app-visualizar-filmes',
  templateUrl: './visualizar-filmes.component.html',
  styleUrls: ['./visualizar-filmes.component.scss']
})
export class VisualizarFilmesComponent implements OnInit {

  readonly semFoto = 'https://www.termoparts.com.br/wp-content/uploads/2017/10/no-image.jpg';

  filme!:Filme;

  constructor(public dialog:MatDialog,
              private activatedRoute:ActivatedRoute,
              private router:Router,
              private filmesService:FilmesService) { }

  ngOnInit(): void {
    this.visualizar(this.activatedRoute.snapshot.params['id']);
  }

  excluir():void{
    const config= {
      data : {
        titulo:'Voce tem certeza que deseja EXCLUIR?',
        descricao: 'Caso voce tenha certeza que deseja excluir, clique no botao OK',
        possuirBtnFechar: true,
        corBtnCancelar:'primary',
        corBtnSucesso:'warn'
      } as Alerta
    };
    const dialogOk = this.dialog.open(AlertaComponent,config);
    dialogOk.afterClosed().subscribe((opcao:boolean)=>{
      if(opcao){
        this.filmesService.excluir(this.filme.id!).subscribe(()=> this.router.navigateByUrl('/filmes'))
      }
    })
  }
 editar():void{
  this.router.navigateByUrl('/filmes/cadastro/' + this.filme.id);
 }

  private visualizar(id:number):void{
    this.filmesService.visualizar(id).subscribe((filme:Filme)=>this.filme=filme);
  }

}
