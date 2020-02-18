/* eslint-disable camelcase */
import models from "../../models";
import response from "../../helpers/response.helper";

const {
    StateReport, LgaReport, AreaReport, StreetReport
} = models;

class Analysis {
    static async details(req, res) {
        const states_count = await StateReport.count();
        const lgas_count = await LgaReport.count();
        const areas_count = await AreaReport.count();
        const streets_count = await StreetReport.count();

        return response.successResponse(res, 200, {
            states_count,
            lgas_count,
            areas_count,
            streets_count
        });
    }
}

export default Analysis;
