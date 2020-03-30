const dx1 = {
    "CRM平台": {
        "test": {
            "autotest": {
                "id": 10
            }
        }
    }
};

const  dx2 =  {
    "CRM平台": {
        "test": {
            "crmadmin": {
                "id": 8
            }
        }
    }
};



var js = [
    {
        "CRM平台": {
            "test": {
                "autotest": {
                    "id": 10
                }
            }
        }
    },
    {
        "CRM平台": {
            "test": {
                "crmadmin": {
                    "id": 8
                }
            }
        }
    },
    {
        "课程顾问平台": {
            "smix5": {
                "13986798666": {
                    "id": 14
                }
            }
        }
    },
    {
        "课程顾问平台": {
            "smix5": {
                "13986798661": {
                    "id": 13
                }
            }
        }
    }
];


console.log(JSON.stringify(Object.assign(dx1, dx2)))


