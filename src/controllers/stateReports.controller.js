import { config } from "dotenv";
import axios from "axios";
import models from "../models";
import response from "../helpers/response.helper";

config();

const { StateReport, LgaReport, AreaReport, StreetReport } = models;

class StateReports {
    static async addState(req, res) {
        const { name, capital } = req.body;

        try {
            const value = await axios.get(
                `https://api.opencagedata.com/geocode/v1/json?q=${name}, Nigeria&key=b7921c262e3b446eb56391139d4812f9&language=en&pretty=1`
            );

            const [data, created] = await StateReport.findOrCreate({
                where: { name },
                defaults: {
                    type: "state",
                    name,
                    capital,
                    geolocation: JSON.stringify(value.data)
                }
            });

            if (!created) {
                return response.errorResponse(res, 400, "State already exists");
            }

            return response.successResponse(res, 201, data);
        } catch (error) {
            return response.errorResponse(res, 400, error);
        }
    }

    static async statesReport(req, res) {
        try {
            const reports = await StateReport.findAll();
            return response.successResponse(res, 200, reports);
        } catch (error) {
            return response.errorResponse(res, 400, error);
        }
    }

    static async stateReport(req, res) {
        try {
            const report = await StateReport.findOne({
                where: { id: req.params.id }
            });
            return response.successResponse(res, 200, report);
        } catch (error) {
            return response.errorResponse(res, 400, error);
        }
    }

    static async stateLGA(req, res) {
        try {
            const report = await LgaReport.findAll({
                where: { stateId: req.params.id }
            });
            return response.successResponse(res, 200, report);
        } catch (error) {
            return response.errorResponse(res, 400, error);
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const { name, capital } = req.body;

            const rep = await StateReport.findOne({
                where: { id }
            });

            if (!rep) {
                return response.errorResponse(
                    res,
                    400,
                    "State does not exists"
                );
            }

            const value = await axios.get(
                `https://api.opencagedata.com/geocode/v1/json?q=${name}, Nigeria&key=b7921c262e3b446eb56391139d4812f9&language=en&pretty=1`
            );

            const data = await rep.update({
                name: name || rep.name,
                capital: capital || rep.capital,
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
            const data = await StateReport.findOne({
                where: { id }
            });

            if (!data) {
                return response.errorResponse(res, 404, "State does not exist");
            }

            await StateReport.destroy({
                where: { id }
            });
            return response.messageResponse(res, 200, "State report deleted");
        } catch (error) {
            return response.errorResponse(res, 400, error);
        }
    }

    static async aggregate(req, res) {
        try {
            const states = await StateReport.findAll();
            const lga = await LgaReport.findAll();
            const areas = await AreaReport.findAll();
            const streets = await StreetReport.findAll();
            const data = [...states, ...lga, ...areas, ...streets];
            return response.successResponse(res, 200, data);
        } catch (error) {
            return response.errorResponse(res, 400, error);
        }
    }
}

export default StateReports;
