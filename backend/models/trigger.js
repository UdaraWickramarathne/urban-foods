class Trigger {
    constructor(triggerName, tableName, triggerType, triggeringEvent, status, triggerBody) {
        this.triggerName = triggerName;
        this.tableName = tableName;
        this.triggerType = triggerType;
        this.triggeringEvent = triggeringEvent;
        this.status = status;
        this.triggerBody = triggerBody;
    }
    static fromDbRow(row, metadata) {
        if (!row || !metadata || !Array.isArray(metadata)) {
            return null;
        }
        let triggerName = null;
        let tableName = null;
        let triggerType = null;
        let triggeringEvent = null;
        let status = null;
        let triggerBody = null;

        metadata.forEach((meta, index) => {
            switch (meta.name) {
                case "TRIGGER_NAME":
                    triggerName = row[index];
                    break;
                case "TABLE_NAME":
                    tableName = row[index];
                    break;
                case "TRIGGER_TYPE":
                    triggerType = row[index];
                    break;
                case "TRIGGERING_EVENT":
                    triggeringEvent = row[index];
                    break;
                case "STATUS":
                    status = row[index];
                    break;
                case "TRIGGER_BODY":
                    triggerBody = row[index];
                    break;
            }
        });

        return new Trigger(triggerName, tableName, triggerType, triggeringEvent, status, triggerBody);
    }
}

export default Trigger;