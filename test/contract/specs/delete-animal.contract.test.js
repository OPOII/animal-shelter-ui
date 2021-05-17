import { provider } from "./init-pact";
import { AnimalController } from "../../../controllers";
import { Matchers } from "@pact-foundation/pact";

describe('Given An Animal service', () => {
    describe('Get a request to delete an animal', () => {
        var animalName = "Rex"
        beforeAll(async () => {
            await provider.setup();
            await provider.addInteraction({
                state: 'delete animal',
                uponReceiving: 'a request to delete an animal',
                withRequest: {
                    method: 'DELETE',
                    path: `/animals/${animalName}`,
                },
                willRespondWith: {
                    status: 204
                }
            });
        });

        it("Then it should return the right data", async() =>{
            const response = await AnimalController.delete(animalName);
            expect(response.data).toMatchSnapshot();
            await provider.verify();
        });

        afterAll(async () => {
            await provider.finalize();
        });
    });
});