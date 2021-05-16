import {Matchers} from '@pact-foundation/pact';
import {AnimalController} from '../../../controllers';
import {provider} from '../config/initPact';

describe('Animal Service', () => {
    describe('When a request to list all animals is made', () => {
        beforeAll(async () => {
            await provider.setup();
            await provider.addInteraction({
                state: 'there are animals',
                uponReceiving: 'a request to list all animals',
                withRequest: {
                    method: 'GET',
                    path: '/animals'
                },
                willRespondWith: {
                    status: 200,
                    body: Matchers.eachLike(
                        {
                            name: Matchers.like('manchas'),
                            breed: Matchers.like("Bengali"),
                            gender: Matchers.term(
                                {generate: "Female", matcher: "Female|Male"}
                            ),
                            isVaccinated: Matchers.boolean(true),
                            vaccines: Matchers.eachLike(
                                [
                                    "rabia"
                                ],
                                {min: 1}
                            )
                        },
                        {min: 2}
                    )
                }
            });
        });

        it('should return the correct data', async () => {
            const response = await AnimalController.list();
            expect(response.data).toMatchSnapshot();
            
            await provider.verify()
        });

        afterAll(async() => { await provider.finalize();
        });
    });
});