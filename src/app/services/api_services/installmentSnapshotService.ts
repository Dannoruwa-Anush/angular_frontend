import { Injectable } from "@angular/core";
import { CrudService } from "./core_services/crud-service";
import { InstallmetSnapshotReadModel } from "../../models/api_models/read_models/installment_snapshot_read_model";
import { HttpClient } from "@angular/common/http";
import { SystemMessageService } from "../ui_service/systemMessageService";
import { BnplSnapShotPayingSimulationCreateModel } from "../../models/api_models/create_update_models/create_models/bnplSnapShotPayingSimulation_create_Model";
import { BnplSnapShotPayingSimulationReadModel } from "../../models/api_models/read_models/bnplSnapShotPayingSimulation_Read_Model";
import { ApiResponseModel } from "../../models/api_models/core_api_models/apiResponseModel";
import { catchError, map } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class InstallmetSnapshotService extends CrudService<InstallmetSnapshotReadModel, InstallmetSnapshotReadModel, InstallmetSnapshotReadModel> {

  protected endpoint = 'BNPL_PlanSettlementSummary';

  constructor(
    http: HttpClient,
    messageService: SystemMessageService
  ) {
    super(http, messageService);
  }

  // Override : pagination
  getLatestSnapshotPaged(
    pageNumber: number,
    pageSize: number,
    searchKey?: string
  ) {
    return this.getPaged(pageNumber, pageSize, {
      searchKey
    });
  }

  // can add custom api methods here
  SimulateSnapShoptPaying(
    data: BnplSnapShotPayingSimulationCreateModel
  ) {
    this._loading.set(true);
    this.messageService.clear();

    return this.http
      .post<ApiResponseModel<BnplSnapShotPayingSimulationReadModel>>(
        `${this.baseUrl}/${this.endpoint}/bnpl-snapshot-payment-simulate`,
        data
      )
      .pipe(
        map(res => {
          this._loading.set(false);
          return res.data;
        }),
        catchError(err => this.handleHttpError(err))
      );
  }
}
