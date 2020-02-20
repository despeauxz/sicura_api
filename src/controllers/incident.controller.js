/* eslint-disable array-callback-return */
import response from "../helpers/response.helper";
import models from "../models";

const { IncidentTypes } = models;

class Incident {
    static async create(req, res) {
        try {
            // let accum = [];
            const { name, weight } = req.body;
            // const incidents = await IncidentTypes.findAll();
            // incidents.map(incident => {
            //     accum = Object.values(incident);
            // });
            // if (
            //     accum.reduce(
            //         (accumulator, currVal) => accumulator + currVal + weight
            //     ) !== 1.0
            // ) {
            //     return response.errorResponse(
            //         res,
            //         400,
            //         "Total values must be in range of 1"
            //     );
            // }
            const incident = await IncidentTypes.create({
                name,
                weight
            });
            return response.successResponse(res, 201, incident);
        } catch (error) {
            return response.errorResponse(res, 400, error);
        }
    }

    static async getIncidences(req, res) {
        try {
            const data = await IncidentTypes.findAll();
            return response.successResponse(res, 201, data);
        } catch (error) {
            return response.errorResponse(res, 400, error);
        }
    }

    static async update(req, res) {
        try {
            const { name, weight } = req.body;
            const { id } = req.params;

            const incidence = await IncidentTypes.findOne({
                where: { id }
            });
            if (!incidence) {
                return response.errorResponse(
                    res,
                    404,
                    "Incident does not exist"
                );
            }

            const data = await incidence.update({
                name: name || incidence.name,
                weight: weight || incidence.weight
            });
            return response.successResponse(res, 200, data);
        } catch (error) {
            return response.errorResponse(res, 400, error);
        }
    }

    static async remove(req, res) {
        try {
            const { id } = req.params;
            const resp = await IncidentTypes.findOne({
                where: { id }
            });
            if (!resp) {
                return response.errorResponse(
                    res,
                    404,
                    "Incidence does not exist"
                );
            }

            await IncidentTypes.destroy({
                where: { id }
            });
            return response.messageResponse(
                res,
                200,
                "Incidence removed successfully"
            );
        } catch (error) {
            return response.errorResponse(res, 400, error);
        }
    }
}

export default Incident;
