import { NotificationType, NotificationsService } from 'angular2-notifications';


export enum JSendStatus {
    success = 'success',
    fail = 'fail',
    error = 'error'
}

export interface JSendResponse {
    status: JSendStatus;
    message: string;
    code: number;
    data: {};    
}

export class JSendNotifiable<T> {
    private _status: NotificationType;
    private _data: T;
    private _message: string;
    private notificationOptions;

    constructor(private notifier: NotificationsService) {
        this.notificationOptions = {
            timeOut: 3000,
            showProgressBar: true,
			pauseOnHover: true,
			clickToClose: true,
            animate: 'fromRight'
        };
    }

    public get status(): NotificationType {
        return this._status;
    }

    public set status(value: NotificationType) {
        this._status = value;
    }

    public get data(): T {
        return this._data;
    }

    public set data(value: T) {
        this._data = value;
    }

    public get message(): string {
        return this._message;
    }

    public set message(value: string) {
        this._message = value;
    }
 
    public notify(): void {
        this.notifier.create(this._message, '', this._status, this.notificationOptions);
    }
}

export class JSendResponseInspector {

    public static inspect<T>(res: JSendResponse, notifier: NotificationsService, entity: string = ''): JSendNotifiable<T> {
        let result: JSendNotifiable<T> = new JSendNotifiable<T>(notifier);
        try {
            switch (res.status) {
                case JSendStatus.success:
                    result.status = NotificationType.Success;
                    result.data = res.data ? res.data[entity] as T : null;
                    result.message = 'Operation success';
                    break;
                case JSendStatus.fail:
                    result.status = NotificationType.Error;
                    result.data = null;
                    result.message = res.data['reason'];
                    break;
                case JSendStatus.error:
                    result.status = NotificationType.Error;
                    result.data = null;
                    result.message = res.message;
                    break;
                default:
                    result.status = NotificationType.Warn;
                    result.data = null;
                    result.message = 'Operation failed';
                    break;
            }
            return result;
        }
        catch (err) {
            console.log(err);
        }
    }
}