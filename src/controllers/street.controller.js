import axios from "axios";
import models from "../models";
import response from "../helpers/response.helper";

const { StreetReport, AreaReport } = models;

class StreetReports {
    static async create(req, res) {
        const { name, report, rating, areaId } = req.body;

        try {
            const area = await AreaReport.findOne({
                where: { id: areaId }
            });
            const areaName = area.dataValues.name;
            const value = await axios.get(
                `https://api.opencagedata.com/geocode/v1/json?q=${name} ${areaName}, Nigeria&key=b7921c262e3b446eb56391139d4812f9&language=en&pretty=1`
            );
            const [data, created] = await StreetReport.findOrCreate({
                where: { name },
                defaults: {
                    type: "street",
                    name,
                    rating,
                    areaId,
                    geolocation: JSON.stringify(value.data),
                    report
                }
            });

            if (!created) {
                return response.errorResponse(
                    res,
                    400,
                    "Street Report already exists"
                );
            }

            return response.successResponse(res, 201, data);
        } catch (error) {
            return response.errorResponse(res, 400, error);
        }
    }

    static async reports(req, res) {
        try {
            const reports = await StreetReport.findAll();
            return response.successResponse(res, 200, reports);
        } catch (error) {
            return response.errorResponse(res, 400, error);
        }
    }

    static async report(req, res) {
        try {
            const report = await StreetReport.findOne({
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
            const { name, areaId, report } = req.body;

            const rep = await StreetReport.findOne({
                where: { id }
            });

            if (!rep) {
                return response.errorResponse(
                    res,
                    400,
                    "Street does not exists"
                );
            }

            const area = await AreaReport.findOne({
                where: { id: areaId }
            });
            const areaName = area.dataValues.name;
            const value = await axios.get(
                `https://api.opencagedata.com/geocode/v1/json?q=${name} ${areaName}, Nigeria&key=b7921c262e3b446eb56391139d4812f9&language=en&pretty=1`
            );

            const data = await rep.update({
                name: name || rep.name,
                areaId: areaId || rep.areaId,
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
            const data = await StreetReport.findOne({
                where: { id }
            });

            if (!data) {
                return response.errorResponse(
                    res,
                    404,
                    "Street does not exist"
                );
            }

            await StreetReport.destroy({
                where: { id }
            });
            return response.messageResponse(res, 200, "Street report deleted");
        } catch (error) {
            return response.errorResponse(res, 400, error);
        }
    }
}

export default StreetReports;
