angular
    .module("bandstagram")
    .service('dataService', function () {
        return Object.create(null, {
            "recordingObject": { "value": {}, "writable": true, "enumerable": true },
            "setRecordingObject": {
                "value": function (recordingObj) {
                    this.recordingObject = recordingObj
                }, "enumerable": true
            },
            "getRecordingObject": {
                "value": function () {
                    return this.recordingObject
                }, "enumerable": true
            }
        })
    });