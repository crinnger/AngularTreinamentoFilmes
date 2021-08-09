import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigParamsService } from './config-params.service';
import { Filme } from 'src/app/shared/models/filme';
import { ConfigPrams } from 'src/app/shared/models/config-prams';

const url = 'http://localhost:3000/filmes/';

@Injectable({
  providedIn: 'root'
})
export class FilmesService {

  constructor(private http: HttpClient,
              private configService: ConfigParamsService) { }

  salvar(filme: Filme): Observable<Filme> {
    return this.http.post<Filme>(url, filme);
  }

  editar(filme: Filme): Observable<Filme> {
    return this.http.put<Filme>(url + filme.id, filme);
  }

  listar(config: ConfigPrams): Observable<Filme[]> {
    const configPrams = this.configService.configurarParametros(config);
    return this.http.get<Filme[]>(url, {params: configPrams});
  }

  listarSemParametros(): Observable<Filme[]> {
    return this.http.get<Filme[]>(url);
  }

  listarComParametros(pagina: number, qtdPagina:number, filtroTexto:string, filtroGenero:string): Observable<Filme[]> {
    let httpParms = new HttpParams();
    httpParms=httpParms.set('_page',pagina.toString())
             .set('_limit',qtdPagina.toString())
             .set('_sort','id')
             .set('_order','desc');
    if(filtroTexto){
      httpParms=httpParms.set('q',filtroTexto);
    }
    if(filtroGenero){
      httpParms=httpParms.set('genero',filtroGenero);
    }

    return this.http.get<Filme[]>(url,{params: httpParms});
  }

  listarComConfig(config:ConfigPrams): Observable<Filme[]> {
    return this.http.get<Filme[]>(url,{params: this.configService.configurarParametros(config)});
  }

  visualizar(id: number): Observable<Filme> {
    return this.http.get<Filme>(url + id);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(url + id);
  }
}
