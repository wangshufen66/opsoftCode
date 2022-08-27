export default class authority {
  idLoad = false;
  idIf = true;
  idDisable = false;
  idShow = true;

  constructor(idLoad = false, idIf = true, idDisable = false, idShow = true) {
    this.idLoad = idLoad;
    this.idIf = idIf;
    this.idDisable = idDisable;
    this.idShow = idShow;
  }

  setIdDisable(value) {
    this.idDisable = value;
  }

  getIdDisable() {
    return this.idDisable;
  }
}
