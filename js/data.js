// ====== House Data ======
// Required fields for each house object
export const REQUIRED_FIELDS = [
    'id', 'nome', 'contato', 'telefone', 'preco',
    'localizacao', 'quartos', 'banheiros', 'garagem',
    'agendamento', 'mobilia', 'status', 'facebookUrl', 'fotos'
];

export const VALID_STATUS = ['available', 'discarded'];
export const VALID_MOBILIA = ['sem', 'semi', 'mobiliado'];

export const casas = [
    {
        id: 1,
        nome: "Rua Allan Kardec — Jardim Italamar",
        contato: "Marcia",
        telefone: "73 99810-1161",
        preco: 1500,
        localizacao: "Rua Allan Kardec 157, Loteamento Jardim Italamar",
        quartos: 2,
        banheiros: 2,
        garagem: true,
        agendamento: "18 / 02 / 2025 - A partir das 17h",
        mobilia: "sem",
        status: "available",
        facebookUrl: "https://www.facebook.com/marketplace/item/1965257111057856/",
        fotos: [
            "Jardim Italamar - Marcia - 1500/foto (1).jpg",
            "Jardim Italamar - Marcia - 1500/Foto (0).jpg",
            "Jardim Italamar - Marcia - 1500/foto (2).jpg",
            "Jardim Italamar - Marcia - 1500/foto (3).jpg",
            "Jardim Italamar - Marcia - 1500/foto (4).jpg",
            "Jardim Italamar - Marcia - 1500/foto (5).jpg",
            "Jardim Italamar - Marcia - 1500/foto (6).jpg",
            "Jardim Italamar - Marcia - 1500/foto (7).jpg"
        ]
    },
    {
        id: 2,
        nome: "Rua Aurora — Goes Calmon",
        contato: "Sara",
        telefone: "(11) 97314-8901",
        preco: 1500,
        localizacao: "Rua Aurora - Goes Calmon",
        quartos: 2,
        banheiros: 2,
        garagem: true,
        agendamento: "Desmarcado - Casa descartada",
        mobilia: "sem",
        status: "discarded",
        facebookUrl: "https://www.facebook.com/marketplace/item/941324115060194/",
        fotos: [
            "Rua Aurora - Goes Calmon/638275929_25814880101454060_5366175479839824541_n.jpg"
        ]
    },
    {
        id: 3,
        nome: "Rua Aroeira — Santo Antônio",
        contato: "Vernon Falcão",
        telefone: "73 9151-6848",
        preco: 1500,
        localizacao: "Rua Aroeira - 165, Santo Antônio, Próx. Cond. Colina Park",
        quartos: 3,
        banheiros: 2,
        garagem: false,
        agendamento: null,
        mobilia: "semi",
        status: "available",
        facebookUrl: "https://www.facebook.com/marketplace/item/2056715964911449/",
        fotos: [
            "Rua Aroeira/633665890_4034422743368817_1160689639168187461_n.jpg",
            "Rua Aroeira/632941580_921076150280079_4963112764048071574_n.jpg",
            "Rua Aroeira/633599220_2845796109145733_1432009332912083024_n.jpg",
            "Rua Aroeira/633613926_1957122665221713_2932704534989087319_n.jpg",
            "Rua Aroeira/633634295_888394024171617_4620845722797266914_n.jpg",
            "Rua Aroeira/633639281_925011296873660_6513286452024018843_n.jpg",
            "Rua Aroeira/633656870_3271878109689691_6174014498371422743_n.jpg",
            "Rua Aroeira/633661634_1226013339114047_865620832502376546_n.jpg",
            "Rua Aroeira/633725609_773787919046441_2192058593017625476_n.jpg",
            "Rua Aroeira/633731954_1614715749550822_1896977895837275062_n.jpg",
            "Rua Aroeira/634933206_942603781453227_6199336669923926537_n.jpg",
            "Rua Aroeira/635032474_2809477222752135_3228520437017592550_n.jpg",
            "Rua Aroeira/635048459_1233777442219727_7010276035451055682_n.jpg",
            "Rua Aroeira/635479269_1328999805728549_3138188772532643115_n.jpg",
            "Rua Aroeira/635648146_1413640983786490_2629931283253745161_n.jpg",
            "Rua Aroeira/635958117_1446776433768823_1762537913971019501_n.jpg",
            "Rua Aroeira/636627467_1225253983131233_6219124093769825264_n.jpg",
            "Rua Aroeira/637736077_1475215317267789_4753170204758050757_n.jpg",
            "Rua Aroeira/638207855_1472595497732792_3726410390029711352_n.jpg",
            "Rua Aroeira/638274182_2639665769743158_458564752166512963_n.jpg",
            "Rua Aroeira/638292075_1254155689555851_5148854413358177546_n.jpg"
        ]
    },
    {
        id: 4,
        nome: "Cond. Eco América",
        contato: "Jeanlucas Silva",
        telefone: "(93) 99131-5678",
        preco: 1400,
        localizacao: "Condomínio Eco América",
        quartos: 2,
        banheiros: 1,
        garagem: false,
        agendamento: null,
        mobilia: "sem",
        status: "discarded",
        facebookUrl: "#",
        fotos: [
            "Condominio Eco America - 1400/534953944_1495013408181744_7442548002452847132_n.jpg",
            "Condominio Eco America - 1400/534894516_2159128607926844_6929777708402955147_n.jpg",
            "Condominio Eco America - 1400/534942225_1298606131816702_3856594512370582699_n.jpg",
            "Condominio Eco America - 1400/535019045_1524277141895273_1133493394192005957_n.jpg",
            "Condominio Eco America - 1400/535376710_1103714881267005_7036994203290793011_n.jpg",
            "Condominio Eco America - 1400/535432481_631263429703895_3920561479129621866_n.jpg",
            "Condominio Eco America - 1400/535438719_1642020896723269_1627533674656593854_n.jpg",
            "Condominio Eco America - 1400/541234426_782214624758448_6623135294006786075_n.jpg",
            "Condominio Eco America - 1400/571193804_1512231596639655_5800142737764555730_n.jpg"
        ]
    }
];
