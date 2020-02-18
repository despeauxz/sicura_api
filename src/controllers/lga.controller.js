import axios from "axios";
import models from "../models";
import response from "../helpers/response.helper";

const { LgaReport, AreaReport, StateReport } = models;

class LGAReports {
    static async create(req, res) {
        const { name, report, rating, stateId } = req.body;

        try {
            const state = await StateReport.findOne({
                where: { id: stateId }
            });
            const stateName = state.dataValues.name;
            const value = await axios.get(
                `https://api.opencagedata.com/geocode/v1/json?q=${name} ${stateName}, Nigeria&key=b7921c262e3b446eb56391139d4812f9&language=en&pretty=1`
            );
            const [data, created] = await LgaReport.findOrCreate({
                where: { name },
                defaults: {
                    type: "lga",
                    name,
                    rating,
                    stateId,
                    geolocation: JSON.stringify(value.data),
                    report
                }
            });

            if (!created) {
                return response.errorResponse(
                    res,
                    400,
                    "LGA Report already exists"
                );
            }

            return response.successResponse(res, 201, data);
        } catch (error) {
            return response.errorResponse(res, 400, error);
        }
    }

    static async LgaArea(req, res) {
        try {
            const report = await AreaReport.findAll({
                where: { lgaId: req.params.id }
            });
            return response.successResponse(res, 200, report);
        } catch (error) {
            return response.errorResponse(res, 400, error);
        }
    }

    static async reports(req, res) {
        try {
            const reports = await LgaReport.findAll();
            return response.successResponse(res, 200, reports);
        } catch (error) {
            return response.errorResponse(res, 400, error);
        }
    }

    static async report(req, res) {
        try {
            const report = await LgaReport.findOne({
                where: { id: req.params.id }
            });
            return response.successResponse(res, 200, report);
        } catch (error) {
            return response.errorResponse(res, 400, error);
        }
    }

    static async remove(req, res) {
        try {
            const { id } = req.params;
            const data = await LgaReport.findOne({
                where: { id }
            });

            if (!data) {
                return response.errorResponse(res, 404, "LGA does not exist");
            }

            await LgaReport.destroy({
                where: { id }
            });
            return response.messageResponse(res, 200, "LGA report deleted");
        } catch (error) {
            return response.errorResponse(res, 400, error);
        }
    }
}

export default LGAReports;
