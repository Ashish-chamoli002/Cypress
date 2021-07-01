
let baseURL = 'https://dummyapi.io/data/api';
const APP_ID = '60dd926eeb387148f21b0a56';


describe('GET user' , () => {
    let userID: string;
    before(() => {
    cy.request({
        url: baseURL+'/user',
        headers: {
            'app-ID': APP_ID
        },
        qs: {
            page: 0,
            limit: 10,
        },
    },).then ((response) => {
        cy.writeFile('cypress/fixtures/users.json', response.body)
        userID = response.body.data[0].id;
    })
});
    it('Validation for first Name ',  () => {
        cy.fixture('users').then((users) => {
            expect(users.data[0].firstName).to.eq('Sara');
        })
    });
    describe('GET user by ID',  () => {
        before( () => {
            cy.request({
                url: `${baseURL}/user/${userID}`,
                headers: {
                    'app-ID': APP_ID
                },
                qs: {
                    page: 0,
                    limit: 10,
                },
            },).as('userId').then ((response) => {
                cy.writeFile('cypress/fixtures/userID.json', response.body)
            })
        })
        it('Validation for email Name ',  () => {
             cy.fixture('userID').then((userID) => {
                expect(userID.email).to.eq('sara.andersen@example.com');
            })
        });
    });
});
describe('POST',() => {
    let postID: string;
    let PostUserID: string;

    before(() => {
        cy.request({
            url: baseURL + '/post',
            headers: {
                'app-ID': APP_ID
            },
            qs: {
                page: 0,
                limit: 10,
            },
        },).then((response) => {
            cy.writeFile('cypress/fixtures/post.json', response.body)
            postID = response.body.data[0].id;
            PostUserID = response.body.data[0].owner.id;

        })
    });
    it('validate user and POST user ID',  () => {
        expect(PostUserID).to.eq('60d0fe4f5311236168a109ca')
        expect(postID).to.eq('60d21b4667d0d8992e610c85')
    });
    describe('GET Post using postID', () => {
        before(() => {
            cy.request({
                url: `${baseURL}/post/${postID}`,
                headers: {
                    'app-ID': APP_ID
                },
                qs: {
                    page: 0,
                    limit: 10,
                },
            },).as('GETPost').then((response) => {
                cy.writeFile('cypress/fixtures/GETPostByPostID.json', response.body)
            })
        });
        it('status validation', () => {
            cy.get('@GETPost').its("status").should('equal', 200);
        })
    });
    describe('GET post by user', () => {
        before(() => {
            cy.request({
                url: `${baseURL}/user/${PostUserID}/post`,
                headers: {
                    'app-ID': APP_ID
                },
                qs: {
                    page: 0,
                    limit: 10,
                },
            },).as('GETPostByUser').then((response) => {
                cy.writeFile('cypress/fixtures/GETPostByUserID.json', response.body)
             })
        });
        it('status validation', () => {
            cy.get('@GETPostByUser').its("status").should('equal', 200);
        })
    });
    describe('GET post by tag', () => {
        let tag:string ;
        before(() => {
            cy.request({
                url: `${baseURL}/tag`,
                headers: {
                    'app-ID': APP_ID
                },
                qs: {
                    page: 0,
                    limit: 10,
                },
            },).then((response) => {
                //cy.writeFile('cypress/fixtures/GETags.json', response.body)
                tag = response.body.data[8];

            });
            cy.request({
                url: `${baseURL}//tag/${tag}/post`,
                headers: {
                    'app-ID': APP_ID
                },
                qs: {
                    page: 0,
                    limit: 10,
                },
            },).as('GETPostByTags').then((response) => {
                cy.writeFile('cypress/fixtures/GETPostByTags.json', response.body)
            });
        });
        it('status validation', () => {
            cy.get('@GETPostByTags').its("status").should('equal', 200);
        })
    })
});