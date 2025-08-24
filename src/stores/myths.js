import { ref } from "vue";
import { defineStore } from "pinia";
import { db } from "@/firebase.js";
import { collection, doc, getDocs, addDoc, deleteDoc, serverTimestamp } from "firebase/firestore";

export const useMythStore = defineStore("myths", () => {
    const defaultMyths = {
        Egyptian: [
            {
                title: "The Contendings of Horus and Seth",
                mythText: `After Osiris is murdered by his brother Seth, his son Horus vies for the throne of Egypt. Through a series of contests—ranging from boat races to magical battles—the two gods strive to prove their worthiness. Ultimately, Ra (or the assembled gods) adjudicates in favor of Horus, restoring order and legitimate kingship.`,
                interpretation: `This myth enshrines the principle of Ma’at (cosmic order) triumphing over chaos. The conflict between Horus and Seth symbolizes the struggle between rightful authority and usurpation, reflecting ancient Egyptians’ deep concern with justice, balance, and the cyclical renewal of the monarchy.`,
                image: "https://cdn.thecollector.com/wp-content/uploads/2022/05/egyptian-gods-seth-and-horus.jpg",
                link: "https://www.thecollector.com/contendings-horus-and-seth-egyptian-titans/",
                isDefault: true,
            },
        ],
        Greek: [
            {
                title: "The Story of Prometheus",
                mythText: `Prometheus, a Titan, defies Zeus by stealing fire from the gods and giving it to humanity. This act of rebellion enables civilization but enrages Zeus, who punishes Prometheus by chaining him to a rock where an eagle eats his liver daily, only for it to regenerate.`,
                interpretation: `The myth explores themes of rebellion, sacrifice, and the human quest for knowledge. Prometheus symbolizes defiance against tyranny and the spirit of innovation, while his suffering reflects the price of progress and the tension between divine authority and human freedom.`,
                image: "https://www.greekmyths-greekmythology.com/wp-content/uploads/2024/12/prometheus-eagle-01-a280X720.webp",
                link: "https://www.greekmyths-greekmythology.com/prometheus-fire-myth/",
                isDefault: true,
            },
        ],
        Norse: [
            {
                title: "The Death of Baldur",
                mythText: `Baldur, the beloved son of Odin and Frigga, is plagued by dreams of death. His mother extracts oaths from all things not to harm him—except mistletoe. Loki exploits this oversight by tricking Hodr, Baldur’s blind brother, into throwing a mistletoe dart, killing Baldur. His death marks the beginning of the events leading to Ragnarok.`,
                interpretation: `The myth reflects Norse fatalism and the inevitability of destiny. It symbolizes the vulnerability of even the purest beings and the far-reaching consequences of trickery and grief. Baldur’s death signals a cosmic imbalance and the coming of the end times.`,
                image: "https://norse-mythology.org/wp-content/uploads/2012/11/The-Death-of-Baldr.jpg",
                link: "https://norse-mythology.org/tales/the-death-of-baldur/",
                isDefault: true,
            },
        ],
        Hindu: [
            {
                title: "The Churning of the Ocean",
                mythText: `In order to obtain amrita (the nectar of immortality), the gods and demons join forces to churn the cosmic ocean using Mount Mandara as a churning rod and the serpent Vasuki as a rope. The process yields both treasures and dangers, including poison which Shiva consumes to save the world.`,
                interpretation: `This myth illustrates cosmic cooperation and the balance between destruction and creation. It represents the struggle for immortality, the emergence of divine order from chaos, and the importance of sacrifice and selflessness.`,
                image: "https://www.sahapedia.org/sites/default/files/styles/sp_page_banner_800x800/public/Samudra%20Manthan_Unknown%20%28production%29%20%5BPublic%20domain%5D.jpg?itok=0wWVOBpT",
                link: "https://www.sahapedia.org/churning-ocean-myth-and-its-yogic-interpretations",
                isDefault: true,
            },
        ],
        Chinese: [
            {
                title: "Nüwa Mends the Heavens",
                mythText: `After a great cosmic catastrophe damages the pillars of heaven and the earth cracks open, the goddess Nüwa melts five different-colored stones to repair the sky and slays a giant turtle to prop up the heavens. Her actions restore balance to the world.`,
                interpretation: `This myth emphasizes the divine role of women in creation and restoration. It symbolizes resilience, compassion, and the harmonizing of chaos through wisdom and effort.`,
                image: "https://fairytales.love/wp-content/uploads/2023/03/chinese-mythology-nuwa.jpg",
                link: "https://fairytales.love/chinese-mythology-nuwa/",
                isDefault: true,
            },
        ],
        Mayan: [
            {
                title: "The Hero Twins and the Lords of Xibalba",
                mythText: `Hunahpu and Xbalanque, the Hero Twins, descend into the Mayan underworld (Xibalba) to avenge their father's death. They outwit the gods of death through trials, trickery, and resurrection, ultimately becoming celestial bodies—the sun and the moon.`,
                interpretation: `This myth portrays the victory of life over death and cleverness over brute power. It reflects Mayan beliefs in transformation, duality, and the cyclical nature of existence.`,
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQw3lbU6TzjckzafJENlSVRe_GZkbHA1vtEKA&s",
                link: "https://www.mesoweb.com/features/twins/twins_text.html",
                isDefault: true,
            },
        ],
    };

    const myths = ref({});

    for (const key in defaultMyths) {
        myths.value[key] = [];
        for (let i = 0; i < defaultMyths[key].length; i++) {
            myths.value[key].push(defaultMyths[key][i]);
        }
    }

    function formatMythologyName(name) {
        if (!name) return "";
        return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    }

    async function fetchMyths() {
        try {
            const snapshot = await getDocs(collection(db, "myths"));
            const firestoreMyths = {};

            snapshot.forEach((docSnap) => {
                const data = docSnap.data();
                const formatted = formatMythologyName(data.mythology);

                if (!firestoreMyths[formatted]) {
                    firestoreMyths[formatted] = [];
                }

                firestoreMyths[formatted].push({
                    id: docSnap.id,
                    mythology: formatted,
                    title: data.title,
                    mythText: data.mythText,
                    interpretation: data.interpretation,
                    image: data.image,
                    link: data.link,
                });
            });

            for (const key in defaultMyths) {
                if (!firestoreMyths[key]) {
                    firestoreMyths[key] = [];
                }

                for (let i = 0; i < defaultMyths[key].length; i++) {
                    let exists = false;
                    for (let j = 0; j < firestoreMyths[key].length; j++) {
                        if (firestoreMyths[key][j].title === defaultMyths[key][i].title) {
                            exists = true;
                            break;
                        }
                    }
                    if (!exists) {
                        firestoreMyths[key].push(defaultMyths[key][i]);
                    }
                }
            }

            for (const key in firestoreMyths) {
                myths.value[key] = [];
                for (let i = 0; i < firestoreMyths[key].length; i++) {
                    myths.value[key].push(firestoreMyths[key][i]);
                }
            }
        } catch (error) {
            console.error("Error fetching myths:", error);
        }
    }

    async function addMyth(mythology, newMyth) {
        try {
            const formatted = formatMythologyName(mythology);
            const docRef = await addDoc(collection(db, "myths"), {
                mythology: formatted,
                title: newMyth.title,
                mythText: newMyth.mythText,
                interpretation: newMyth.interpretation,
                image: newMyth.image,
                link: newMyth.link,
                createdAt: serverTimestamp(),
            });

            if (!myths.value[formatted]) myths.value[formatted] = [];
            myths.value[formatted].push({
                id: docRef.id,
                mythology: formatted,
                title: newMyth.title,
                mythText: newMyth.mythText,
                interpretation: newMyth.interpretation,
                image: newMyth.image,
                link: newMyth.link,
            });
        } catch (error) {
            console.error("Error adding myth:", error);
        }
    }

    async function deleteMyth(mythology, mythId) {
        const formatted = formatMythologyName(mythology);
        if (!myths.value[formatted]) return;

        let mythToDelete = null;
        for (let i = 0; i < myths.value[formatted].length; i++) {
            if (myths.value[formatted][i].id === mythId) {
                mythToDelete = myths.value[formatted][i];
                break;
            }
        }

        if (!mythToDelete) return;
        if (mythToDelete.isDefault) {
            console.warn("Default myths cannot be deleted!");
            return;
        }

        try {
            await deleteDoc(doc(db, "myths", mythId));

            const newArray = [];
            for (let i = 0; i < myths.value[formatted].length; i++) {
                if (myths.value[formatted][i].id !== mythId) {
                    newArray.push(myths.value[formatted][i]);
                }
            }
            myths.value[formatted] = newArray;
        } catch (error) {
            console.error("Error deleting myth:", error);
        }
    }

    return { myths, fetchMyths, addMyth, deleteMyth };
});
