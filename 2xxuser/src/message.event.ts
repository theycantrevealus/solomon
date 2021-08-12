export class Message {
    user_uid: string;
    table_name: string;
    action: string;
    logged_at: string;
    old_value: string;
    new_value: string;
    status: string;
    login_id: string;
    unique_target: string;

    constructor(data) {
        this.user_uid = data.user_uid;
        this.table_name = data.table_name;
        this.action = data.action;
        this.logged_at = data.logged_at;
        this.old_value = data.old_value;
        this.new_value = data.new_value;
        this.status = data.status;
        this.login_id = data.login_id;
        this.unique_target = data.unique_target;
    }
}