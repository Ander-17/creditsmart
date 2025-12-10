// import { db } from "./firebase/config";
// import { collection, addDoc } from "firebase/firestore";

/* const creditsData =[
    {
        name: "Crédito de libre inversión",
        description: "Dinero más rápido",
        minAmount: 1000000,
        maxAmount: 3000000,
        interestRate: 1.5,
        maxTerm: 60,
        requirements: "Mayor a 18 años, ingresos mínimos de 1.500.000",
        icon: "💳",

    }, 

    {
        name: "Crédito de Vehículo",
        description: "Adquiere el carro que siempre quisiste",
        minAmount: 5000000,
        maxAmount: 100000000,
        interestRate: 1.2,
        maxTerm: 72,
        requirements: "Mayor a 18 años, ingresos mínimos de 1.500.000",
        icon: "🚘",

    },

    {
        name: "Crédito hipotecario",
        description: "Financia la compra de tu vivienda con las mejores tasas del mercado",
        minAmount: 20000000,
        maxAmount: 300000000,
        interestRate: 0.9,
        maxTerm: 240,
        requirements: "Mayor a 18 años, ingresos mínimos de 1.500.000",
        icon: "🏠",

    },

    {
        name: "Crédito educativo",
        description: "Cubre los costos de tu educación superior, pregrado o posgrado.",
        minAmount: 1000000,
        maxAmount: 3000000,
        interestRate: 1.0,
        maxTerm: 48,
        requirements: "Mayor a 18 años, ingresos mínimos de 1.000.000",
        icon: "🎓",

    },

    {
        name: "Crédito empresarial",
        description: "Impulsa tu negocio o empresa con capital de trabajo o inversión",
        minAmount: 10000000,
        maxAmount: 500000000,
        interestRate: 1.8,
        maxTerm: 84,
        requirements: "Mayor a 18 años, ingresos mínimos de 1.500.000",
        icon: "💼",

    },

    {
        name: "Crédito de nómina",
        description: "Préstamo fácil y rápido con descuento directo de tu nómina",
        minAmount: 500000,
        maxAmount: 40000000,
        interestRate: 1.1,
        maxTerm: 48,
        requirements: "Mayor a 18 años, ingresos mínimos de 1.500.000",
        icon: "💵",

    },
];

const seedFirestore = async () => {
    try {
        console.log("Cargando datos...");
        for (const credit of creditsData) {
            const docRef = await addDoc(collection(db, "credits"), credit);
            console.log(`${credit.name} agregando con ID:${docRef.id}`);
        }


        console.log("Todos los créditos fueron cargados existosamente");
        console.log("En cuanto persistan los registros, borrar este archivo");


    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
}

seedFirestore(); */
