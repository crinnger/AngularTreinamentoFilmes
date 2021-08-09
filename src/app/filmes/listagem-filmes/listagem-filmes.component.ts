import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { FilmesService } from 'src/app/core/core/filmes.service';
import { ConfigPrams } from 'src/app/shared/models/config-prams';
import { Filme } from 'src/app/shared/models/filme';

@Component({
  selector: 'dio-listagem-filmes',
  templateUrl: './listagem-filmes.component.html',
  styleUrls: ['./listagem-filmes.component.scss']
})
export class ListagemFilmesComponent implements OnInit{

  readonly semFoto = 'https://www.termoparts.com.br/wp-content/uploads/2017/10/no-image.jpg';


  config: ConfigPrams ={
    pagina:0,
    limite:4
  }

  filmes: Filme[]=[];


  filtros!:FormGroup;

  generos= ['Açao','Romance','Terror','Aventura','Comedia','Drama','Sci-Fi'];

  constructor(private filmesService: FilmesService,
              private fb: FormBuilder,
              private router:Router) {

  }
  ngOnInit(): void {
    //this.filmesService.listarSemParametros().subscribe((filmes:Filme[])=> this.filmes=filmes);
    this.listarFilmes();

    this.filtros=this.fb.group(
      {
        texto: [''],
        genero: [''],
      }
    )

    this.filtros.get('texto')?.valueChanges
    .pipe(debounceTime(500))
    .subscribe((val:string)=> {
      this.config.pesquisa=val;
      this.filtroFilmes();
    })

    this.filtros.get('genero')?.valueChanges.subscribe((val:string)=> {
      this.config.campo={tipo:'genero', valor:val};
      this.filtroFilmes();
    })
  }

  onScroll() {
    this.listarFilmes();
  }

  abrir(id?:number):void{
    this.router.navigateByUrl('/filmes/' + id);
  }

  private listarFilmes():void{
    this.config.pagina++;
    this.filmesService.listarComConfig(this.config)
    .subscribe((filmes:Filme[])=> this.filmes.push(...filmes));
  }

  private filtroFilmes(){
    this.config.pagina=0;
    this.filmes=[];
    this.listarFilmes();
  }

}
