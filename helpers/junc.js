let update;
switch (deliveryType?.toLowercase()) {
    case "agent":
        update = await Sent_package.udpateMany({ _id: { $in: ["123", "456", "789"] } })
            (
                {
                    _id: Logs[i].package
                }).populate('createdBy')
        break;
    case "doorstep":

        break;
    case "courier":

        break;
    case "shelf":

        break;
    case "sale":

        break;




