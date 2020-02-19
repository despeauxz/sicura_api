import axios from "axios";
import models from "../models";
import response from "../helpers/response.helper";

const { AreaReport, StreetReport, LgaReport } = models;

class AreaReports {
    static async create(req, res) {
        const { name, report, rating, lgaId } = req.body;

        try {
            const lga = await LgaReport.findOne({
                where: { id: lgaId }
            });
            const lgaName = lga.dataValues.name;
            const value = await axios.get(
                `https://api.opencagedata.com/geocode/v1/json?q=${name} ${lgaName}, Nigeria&key=b7921c262e3b446eb56391139d4812f9&language=en&pretty=1`
            );
            const [data, created] = await AreaReport.findOrCreate({
                where: { name },
                defaults: {
                    type: "area",
                    name,
                    rating,
                    lgaId,
                    geolocation: JSON.stringify(value.data),
                    report
                }
            });

            if (!created) {
                return response.errorResponse(
                    res,
                    400,
                    "Area Report already exists"
                );
            }

            return response.successResponse(res, 201, data);
        } catch (error) {
            return response.errorResponse(res, 400, error);
        }
    }

    static async reports(req, res) {
        try {
            const reports = await AreaReport.findAll();
            return response.successResponse(res, 200, reports);
        } catch (error) {
            return response.errorResponse(res, 400, error);
        }
    }

    static async AreaStreet(req, res) {
        try {
            const report = await StreetReport.findAll({
                where: { areaId: req.params.id }
            });
            return response.successResponse(res, 200, report);
        } catch (error) {
            return response.errorResponse(res, 400, error);
        }
    }

    static async report(req, res) {
        try {
            const report = await AreaReport.findOne({
                where: { id: req.params.id }
            });
            return response.successResponse(res, 200, report);
        } catch (error) {
            return response.errorResponse(res, 400, error);
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const { name, lgaId, report } = req.body;

            const rep = await AreaReport.findOne({
                where: { id }
            });

            if (!rep) {
                return response.errorResponse(res, 400, "Area does not exists");
            }

            const lga = await LgaReport.findOne({
                where: { id: lgaId }
            });
            const lgaName = lga.dataValues.name;

            const value = await axios.get(
                `https://api.opencagedata.com/geocode/v1/json?q=${name} ${lgaName}, Nigeria&key=b7921c262e3b446eb56391139d4812f9&language=en&pretty=1`
            );

            const data = await rep.update({
                name: name || rep.name,
                lgaId: lgaId || rep.lgaId,
                report: report || rep.report,
                geolocation: JSON.stringify(value.data)
            });

            return response.successResponse(res, 200, data);
        } catch (error) {
            return response.errorResponse(res, 400, error);
        }
    }

    static async remove(req, res) {
        try {
            const { id } = req.params;
            const data = await AreaReport.findOne({
                where: { id }
            });

            if (!data) {
                return response.errorResponse(res, 404, "Area does not exist");
            }

            await AreaReport.destroy({
                where: { id }
            });
            return response.messageResponse(res, 200, "Area report deleted");
        } catch (error) {
            return response.errorResponse(res, 400, error);
        }
    }
}

export default AreaReports;
