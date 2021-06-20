export default class GroupsHandler {
    constructor(groupsGetted) {
        this.groupsGetted = groupsGetted;
    }
    reCreateGroups(groups) {
        let newGroups = [];
        groups.forEach((group) => {
            if (group.layers) {
                // check subgroups
                if (group.groups) {
                    group.groups = this.reCreateGroups(group.groups);
                    if (group.groups.length === 0) {
                        group.groups = undefined;
                        delete group.groups;
                    }
                }
                newGroups.push(group);
            } else if (group.groups) {
                group.groups = this.reCreateGroups(group.groups);
            }
        });
        return newGroups;
    }

    init(channel) {
        channel.getSupportedFunctions((data) => {
            if (data.getAllGroups === true) {
                channel.getAllGroups((groups) => {
                    this.groupsGetted(this.reCreateGroups(groups));
                });
            }
        });
    }

    synchronize(_channel, _state) {

    }
}