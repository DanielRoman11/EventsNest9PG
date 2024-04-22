import { ListEntityQuery } from "../../shared/ListEntityQuery";

export class ListEvents extends ListEntityQuery {}

export enum AttendanceResponse {
  Yes = 1,
  No,
  Maybe,
  Declined,
  Interested,
}

  
