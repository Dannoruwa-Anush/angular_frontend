import { Injectable } from "@angular/core";
import { CrudService } from "./core_services/crud-service";
import { InstallmetSnapshotReadModel } from "../../models/api_models/read_models/installment_snapshot_read_model";
import { HttpClient } from "@angular/common/http";
import { SystemMessageService } from "../ui_service/systemMessageService";

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
}
