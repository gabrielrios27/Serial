import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { TvShow } from './../../interfaces/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-my-list',
  templateUrl: './my-list.component.html',
  styleUrls: ['./my-list.component.scss'],
})
export class MyListComponent implements OnInit {
  toSearch: string;
  isTypeList: boolean;

  idList: number;
  nameList: string;

  idTvShow: number;
  type: string;
  isTypeSaved: boolean;
  selectedSavedLists: any;
  savedList: any;
  likedList: any;
  likedTvShows: any;
  listToShow: any;
  listToShowComplete: any[];
  imgLikedList: any = [
    {
      id: 102567,
      poster_path: '/6wrUL1boBJIRlgwdmFKOlbhllDh.jpg',
    },
    {
      id: 62560,
      poster_path: '/oKIBhzZzDX07SoE2bOLhq2EE8rf.jpg',
    },
    {
      id: 37680,
      poster_path: '/vQiryp6LioFxQThywxbC6TuoDjy.jpg',
    },
    {
      id: 1399,
      poster_path: '/7WUHnWGx5OO145IRxPDUkQSh4C7.jpg',
    },
  ];
  imgSavedList: any = [
    {
      id: 1402,
      poster_path: '/xf9wuDcqlUPWABZNeDKPbZUjWx0.jpg',
    },
    {
      id: 1418,
      poster_path: '/ooBGRQBdbGzBxAVfExiO8r7kloA.jpg',
    },
    {
      id: 57243,
      poster_path: '/sz4zF5z9zyFh8Z6g5IQPNq91cI7.jpg',
    },
    {
      id: 1396,
      poster_path: '/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
    },
  ];
  idTvShowSelected: number;
  isDeleteItem: boolean;
  tvShowToLikeFromCard: TvShow;
  isNewList: boolean;
  // Para cuando se crea una lista
  newNameList: string;
  newDescriptionList: string;
  emptyInputs: boolean;
  tvShowToSaveInNewList: TvShow;
  // suscripciones
  onDestroy$: Subject<boolean> = new Subject();
  constructor(
    private _UserSvc: UserService,
    private _rutaActiva: ActivatedRoute,
    private _route: Router
  ) {
    this.listToShow = [];
    this.toSearch = '';
    this.idList = 0;
    this.nameList = 'Lista n2';
    this.idTvShowSelected = 0;
    this.isTypeList = false;
    this.idTvShow = 0;
    this.type = 'saved';
    this.isTypeSaved = true;
    this.isDeleteItem = false; //Para modal de eliminar item
    this.tvShowToLikeFromCard = {} as TvShow;
    this.listToShowComplete = [];
    this.selectedSavedLists = {};
    this.selectedSavedLists.name = '';
    this.selectedSavedLists.description = ' / ';
    this.isNewList = false;
    this.newNameList = '';
    this.newDescriptionList = '';
    this.emptyInputs = false;
    this.tvShowToSaveInNewList = {} as TvShow;
  }

  ngOnInit(): void {
    this.isTypeList = this.getFromLclStg('isTypeListInsideList');
    console.log('this.isTypeList', this.isTypeList);
    this.getFromRoute();
  }
  getFromRoute() {
    let idToShow;
    let type;
    this._rutaActiva.paramMap
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((params: ParamMap) => {
        idToShow = params.get('id');
        type = params.get('type');
      });
    this.idList = Number(idToShow);
    if (type === 'saved') {
      this.isTypeSaved = true;
      this.getSavedList();
    } else if (type === 'liked') {
      this.isTypeSaved = false;
      this.getLikedList();
    } else {
      this.isNewList = true;
      this.getTvShowById(this.idList);
    }
  }
  onSaveNewList() {
    console.log('this.newNameList: ', this.newNameList);
    console.log('this.newDescriptionList: ', this.newDescriptionList);
    if (this.newNameList && this.newDescriptionList) {
      let description = this.newNameList + ' / ' + this.newDescriptionList;
      this.createNewList(description);
    } else {
      this.emptyInputs = true;
    }
  }
  createNewList(description: string) {
    this._UserSvc
      .createNewList(description)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (data: any) => {
          console.log('created Ok: ', data);
          if (this.idList === 0) {
            this._route.navigate(['./lists']);
          } else {
            this.onAddTvShowToSaved(this.tvShowToSaveInNewList, data.id);
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  getTvShowById(id: number) {
    this._UserSvc
      .getTvShowById(id)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (tvShow: TvShow) => {
          console.log(tvShow);
          this.tvShowToSaveInNewList = tvShow;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  onAddTvShowToSaved(tv: TvShow, idList: number) {
    this._UserSvc
      .addTvShowToSaved(tv, idList)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (data: any) => {
          console.log('onAddTvShowToSaved: ', data);
          this._route.navigate(['./lists']);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  getLikedList() {
    this._UserSvc
      .getLikedList()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (data: any) => {
          // this.likedList = data.lists;
          this.likedTvShows = data.series;
          this.likedTvShows.map((tv: any) => {
            tv.film.isLiked = true;
            tv.film.isSaved = false;
            tv.film.idListSaved = 0;
            tv.film.idGeneral = tv.id;
            tv.film.idListSaved = 0;
          });
          if (this.isTypeSaved) {
            // chekear coincidencias
            this.checkMatches();
          } else {
            this.listToShow = this.likedTvShows;
            this.listToShowComplete = this.listToShow;
            this.getSavedList();
          }

          //Para modal-delete
          // this.idList = this.listToShow.id;
          // this.nameList = this.listToShow.description;

          console.log('this.likedTvShows: ', this.likedTvShows);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  getSavedList() {
    this._UserSvc
      .getSavedList()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (data: any) => {
          this.savedList = data;
          for (let list of this.savedList) {
            list.list_movies.map((tv: any) => {
              tv.film.isLiked = false;
              tv.film.isSaved = true;
              tv.film.idListSaved = list.id;
              tv.film.idGeneral = tv.id;
            });
          }

          console.log('this.savedList: ', this.savedList);
          if (this.isTypeSaved) {
            this.selectedSavedLists = this.savedList.find(
              (list: any) => list.id === this.idList
            );
            console.log('this.selectedSavedLists ', this.selectedSavedLists);

            const descriptionParts =
              this.selectedSavedLists.description.split(' / ');
            descriptionParts[0]
              ? (this.selectedSavedLists.name = descriptionParts[0])
              : (this.selectedSavedLists.name = 'List');
            descriptionParts[1]
              ? (this.selectedSavedLists.description = descriptionParts[1])
              : (this.selectedSavedLists.description = '');
            this.listToShow = this.selectedSavedLists.list_movies;
            this.listToShowComplete = this.listToShow;
            console.log('SAved - this.listToShow: ', this.listToShow);

            this.getLikedList();
          } else {
            // chekear coincidencias
            this.checkMatches();
          }

          //Para modal-delete
          // this.idList = this.listToShow.id;
          // this.nameList = this.listToShow.description
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  checkMatches() {
    for (let list of this.savedList) {
      list.list_movies.map((tvSaved: any) => {
        this.likedTvShows.map((tvLiked: any) => {
          if (tvLiked.film.id === tvSaved.film.id) {
            tvSaved.film.isLiked = true;
            tvLiked.film.isSaved = true;
            tvLiked.film.idListSaved = list.id;
          }
        });
      });
    }
    this.isTypeSaved
      ? (this.listToShow = this.savedList.find(
          (list: any) => list.id === this.idList
        ).list_movies)
      : (this.listToShow = this.likedTvShows);
    console.log('listToShow: ', this.listToShow);
    this.listToShowComplete = this.listToShow;
    console.log('this.listToShowComplete: ', this.listToShowComplete);
  }
  getFromLclStg(key: string): any {
    let value = localStorage.getItem(key);
    if (value) {
      return JSON.parse(value);
    }
  }
  Search(toSearchVal: string) {
    console.log(toSearchVal);
    if (toSearchVal === '') {
      this.listToShow = this.listToShowComplete;
    } else {
      this.listToShow = this.listToShowComplete.filter((item) =>
        item.film.title.toLowerCase().includes(toSearchVal.toLowerCase())
      );
    }
  }
  onLike(tv: any, isLiked: boolean) {
    console.log(tv);

    if (isLiked) {
      //endp. eliminar like
      this.onDeleteLikeTvShow(tv.film.id);
      if (!this.isTypeSaved) {
        this.listToShowComplete = this.listToShowComplete.filter(
          (item) => item.film.id !== tv.film.id
        );
        this.listToShow = this.listToShowComplete;
      } else {
        this.listToShowComplete = this.listToShowComplete.map((item) => {
          if (item.film.id === tv.film.id) item.film.isLiked = false;
          return item;
        });
        this.listToShow = this.listToShowComplete;
      }
    } else {
      //endp. guardar en favoritos - like
      this.onLikeTvShow(tv.film);
      this.listToShowComplete = this.listToShowComplete.map((item) => {
        if (item.film.id === tv.film.id) item.film.isLiked = true;
        return item;
      });
      this.listToShow = this.listToShowComplete;
    }
  }
  onLikeTvShow(tv: TvShow) {
    this._UserSvc
      .likeTvShow(tv)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (data: any) => {
          console.log('onLikeTvShow: ', data);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  onDeleteLikeTvShow(id: number) {
    this._UserSvc
      .delteLikeTvShow(id)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (data: any) => {
          console.log('delteLikeTvShow data: ', data);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  onSave(tvShow: any, idListSaved: number, isSaved: boolean) {
    if (isSaved) {
      //endp. eliminar de guardados con id y id-list
      this.onDeleteSavedTvShow(tvShow.film.id, idListSaved);
      if (!this.isTypeSaved) {
        //Dentro de lista liked
        this.listToShowComplete = this.listToShowComplete.map((item) => {
          if (item.film.id === tvShow.film.id) item.film.isSaved = false;
          return item;
        });
        this.listToShow = this.listToShowComplete;
      } else {
        //Dentro de una lista Saved
        this.listToShowComplete = this.listToShowComplete.filter(
          (item) => item.film.id !== tvShow.film.id
        );
        this.listToShow = this.listToShowComplete;
      }
    } else {
      this._route.navigate(['./lists/' + tvShow.film.id]);
      //navegar a /lists/:id
    }
  }
  onDeleteSavedTvShow(idTv: number, idListSaved: number) {
    this._UserSvc
      .deleteTvShowSaved(idTv, idListSaved)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (data: any) => {
          console.log('deleteTvShowSaved data: ', data);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  toogleType() {
    this.isTypeList = !this.isTypeList;
    console.log('this.isTypeList: ', this.isTypeList);
    this.saveInLclStg('isTypeListInsideList', this.isTypeList);
  }
  saveInLclStg(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  }
  getIdTvShowSelected(id: number) {
    this.idTvShowSelected = id;
  }
  getTvShowToLikeFromCard(tv: TvShow) {
    console.log('tvShowToLikeFromCardFromCard: ', tv);
    this.tvShowToLikeFromCard = tv;
    this.onLikeFromCard(tv, tv.isLiked);
  }
  getTvShowToSaveFromCard(tv: TvShow) {
    this.onSaveFromCard(tv, this.idList, tv.isSaved);
  }
  toogleModalDelete(value: boolean) {
    this.isDeleteItem = value;
  }
  isDelete(event: boolean) {
    if (event) {
      console.log('Aqui endp. eliminar lista'); //-------------------------------
      // Al terminar navegar a list
      this._route.navigate(['./lists']);
    } else {
      console.log('Lista eliminada');
      this.isDeleteItem = false;
    }
  }
  onDeleteItem() {
    this.isDeleteItem = true;
  }
  onLikeFromCard(tv: any, isLiked: boolean) {
    console.log(tv);
    if (isLiked) {
      if (!this.isTypeSaved) {
        this.onDeleteLikeTvShow(tv.id);
        this.listToShowComplete = this.listToShowComplete.filter(
          (item) => item.film.id !== tv.id
        );
        this.listToShow = this.listToShowComplete;
      } else {
        this.onDeleteLikeTvShow(tv.id);
        this.listToShowComplete = this.listToShowComplete.map((item) => {
          if (item.film.id === tv.id) item.film.isLiked = false;
          return item;
        });
        this.listToShow = this.listToShowComplete;
      }
    } else {
      //endp. guardar en favoritos - like
      this.listToShowComplete = this.listToShowComplete.map((item) => {
        if (item.film.id === tv.id) item.film.isLiked = true;
        return item;
      });
      this.listToShow = this.listToShowComplete;
    }
  }
  onSaveFromCard(tvShow: any, idListSaved: number, isSaved: boolean) {
    if (isSaved) {
      //endp. eliminar de guardados con id y id-list
      if (!this.isTypeSaved) {
        //Dentro de lista liked
        this.onDeleteSavedTvShow(tvShow.id, tvShow.idListSaved);
        this.listToShowComplete = this.listToShowComplete.map((item) => {
          if (item.film.id === tvShow.id) item.film.isSaved = false;
          return item;
        });
        this.listToShow = this.listToShowComplete;
      } else {
        //Dentro de una lista Saved
        console.log('tvShow.id: ', tvShow.id);

        this.onDeleteSavedTvShow(tvShow.id, idListSaved);
        this.listToShowComplete = this.listToShowComplete.filter(
          (item) => item.film.id !== tvShow.id
        );
        this.listToShow = this.listToShowComplete;
      }
    } else {
      this._route.navigate(['./lists/' + tvShow.id]);
      //navegar a /lists/:id
    }
  }
  ngOnDestroy() {
    this.onDestroy$.next(true);
  }
}
