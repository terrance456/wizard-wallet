export enum ApiBasePath {
  basePath = "/api",
}

export enum ApiRoutes {
  getMonthDebts = ApiBasePath.basePath + "/monthly-debt",
  addMonthlyDebt = ApiBasePath.basePath + "/add-monthly-debt",
  updatePosition = ApiBasePath.basePath + "/update-position",
  deleteDebt = ApiBasePath.basePath + "/remove-monthly-debt",
}
