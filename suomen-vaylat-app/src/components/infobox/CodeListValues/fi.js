/**
 * Hardcoded layer feature codelist values in finnish.
 *
 * Locale object contains 0...n layer objects.
 *
 * '<layer name>': {
 *    '<feature_attribute_name>': {
 *       '<feature_attribute_codelist1>': '<codelist1 value for finnish>',
 *       '<feature_attribute_codelist2>': '<codelist2 value for finnish>'
 *    }
 * }
 *
 * For example:
 * 'vesivaylatiedot:lajitysalueet': {
 *        'laj_tyyppi': {
 *            0: 'aaa',
 *            1: 'bbb'
 *        }
 *   }
 */
export const fi = {
    'vesivaylatiedot:lajitysalueet': {
        'laj_tyyppi': {
            0: 'Tuntematon',
            1: 'Vesiläjitys',
            2: 'Allasläjitys'
        },
        'maalaatu': {
            'Sr': 'Sora',
            'Mu': 'Muta',
            'Lj': 'Lieju',
            'Ka': 'Kallio',
            'Mr': 'Moreeni',
            'Hk': 'Hiekka',
            'Ki': 'Kivikko',
            'Sa': 'Savi',
            'Si': 'Siltti'
        }
    },
    'vesivaylatiedot:navigointilinjat': {
        'laatulk': {
            0: 'Tuntematon',
            1: 'Laatuluokka 1',
            2: 'Laatuluokka 2',
            3: 'Laatuluokka 3'
        },
        'navlin_ty': {
            1: 'Suora linja (Suora)',
            2: 'Murtoviiva (Murtov.)',
            3: 'Pakollinen kaarre (Kaarre)',
            4: 'Teoreettinen kaarre (Kaarre Ve)'
        },
        'tila': {
            1: 'Vahvistettu (Vahv.)',
            2: 'Aihio (Aih.)',
            3: 'Muutoksen alainen (Muut. ala.)',
            4: 'Muutosaihio (Muut. aih.)',
            5: 'Poiston alainen (Poist. aih.)',
            6: 'Poistettu (Poist.)'
        }
    },
    'vesivaylatiedot:paivatunnukset': {
        'pmm_tyyp': {
            0: 'Tuntematon',
            1: 'Kantakolmio',
            2: 'Sukkulamainen',
            3: 'Neliömäinen',
            4: 'Pyöreä',
            5: 'Kartiomainen',
            6: 'Lieriömäinen',
            7: 'Pallomainen',
            8: 'Pylväsmäinen',
            9: 'Tynnyrimäinen',
            10: 'Suorakaide',
            11: 'Suunnikas',
            12: 'Putkimainen',
            13: 'Tarkemmin määrittelemätön',
            14: 'Neliö kärjellään',
            15: 'Loistokoju',
            16: 'Majakkatorni',
            17: 'Rakennus',
            18: 'Masto',
            19: 'Seiväs',
            20: 'Putkiteline',
            21: 'Tiimalasi',
            22: 'Kärkikolmio'
        },
        'pmvs_tyyp': {
            0: 'Tuntematon',
            1: 'Vaakavyöt ylhäältä lukien',
            2: 'Pystyraidat',
            3: 'Vinoraidat',
            4: 'Ruudut',
            5: 'Yksivärinen',
            6: 'Tausta/kärkikolmio',
            7: 'Yläosa/alaosa',
            8: 'Tausta/kantakolmio',
            9: 'Vasen/oikea',
            10: 'Reunus/sisus'
        },
        'pmv_tyyp': {
            0: 'Tuntematon',
            1: 'Vihreä',
            2: 'Musta',
            3: 'Punainen',
            4: 'Keltainen',
            5: 'Valkoinen',
            6: 'Oranssi',
            7: 'Musta/keltainen',
            8: 'Keltainen/musta',
            9: 'Punainen/valkoinen',
            10: 'Valkoinen/punainen',
            11: 'Vihreä/punainen',
            12: 'Punainen/vihreä',
            13: 'Vihreä/valkoinen',
            14: 'Musta/punainen/musta',
            15: 'Punainen/musta/punainen',
            16: 'Punainen/keltainen/punainen',
            17: 'Keltainen/punainen/keltainen',
            18: 'Musta/valkoinen/musta',
            19: 'Valkoinen/musta/valkoinen',
            20: 'Keltainen/musta/keltainen',
            21: 'Musta/keltainen/musta',
            22: 'Punainen/valkoinen/punainen',
            23: 'Valkoinen/punainen/valkoinen',
            24: 'Musta/valkoinen',
            25: 'Valkoinen/musta',
            26: 'Keltainen/valkoinen/keltainen',
            27: 'Valkoinen/keltainen/valkoinen',
            28: 'Keltainen/sininen/keltainen',
            29: 'Sininen/keltainen/sininen',
            30: 'Oranssi/valkoinen',
            31: 'Valkoinen/oranssi',
            32: 'Oranssi/musta',
            33: 'Musta/oranssi',
            34: 'Musta/oranssi/musta',
            35: 'Oranssi/musta/oranssi',
            36: 'Punainen/keltainen',
            37: 'Harmaa',
            38: 'Keltainen/punainen',
            39: 'Oranssi/vihreä/oranssi',
            40: 'Ruskea',
            41: 'Sininen/valkoinen',
            42: 'Oranssi/valkoinen/oranssi',
            43: 'Valkoinen/sininen/valkoinen',
            44: 'Punainen/harmaa',
            45: 'Valkoinen/oranssi/valkoinen',
            46: 'Keltainen/valkoinen',
            47: 'Valkoinen/maalamaton',
            48: 'Harmaa/punainen',
            55: 'Valkoinen/vihreä'
        },
        'pmpm_tyyp': {
            1: 'Aaltomainen lasikuitulevy',
            2: 'Alumiinilevy heijastimella',
            3: 'Puupinta',
            4: 'Kivipinta',
            5: 'Betonipinta',
            6: 'Teräspinta',
            7: 'Vaneripinta',
            8: 'Tiilipinta',
            9: 'Mineriittilevy',
            10: 'Lasikuitupinta',
            11: 'Aaltomainen muovilevy',
            12: 'Muovipinta'
        }
    },
    'vesivaylatiedot:rajoitusalueet_a': {
        'rajoitustyypit': {
            '01': 'Nopeusrajoitus',
            '02': 'Aallokon aiheuttamisen kielto',
            '03': 'Purjelautailukielto',
            '04': 'Vesiskootterilla ajo kielletty',
            '05': 'Aluksen kulku moottorivoimaa käyttäen kielletty',
            '06': 'Ankkurin käyttökielto',
            '07': 'Pysäköimiskielto',
            '08': 'Kiinnittymiskielto',
            '09': 'Ohittamiskielto',
            '10': 'Kohtaamiskielto',
            '11': 'Nopeussuositus'
        }
    },
    'vesivaylatiedot:ruoppausalueet': {
        'ruop_menet': {
            0: 'Tuntematon',
            1: 'Imuruoppaus',
            2: 'Kauharuoppaus',
            3: 'Sukellustyö'
        }
    },
    'vesivaylatiedot:turvalaitteet': {
        'navl_tyyp': {
            0: 'Tuntematon',
            1: 'Vasen',
            2: 'Oikea',
            3: 'Pohjois',
            4: 'Etelä',
            5: 'Länsi',
            6: 'Itä',
            7: 'Karimerkki',
            8: 'Turvavesimerkki',
            9: 'Erikoismerkki',
            99: 'Ei sovellettavissa'
        },
        'tklnumero': {
            0: 'Tuntematon',
            51: 'Geod. tarkk. 1 (0,12 m / 0,3 m)',
            52: 'Geod. tarkk. 2 (0,2 m / 0,5 m)',
            53: 'Geod. tarkk. 3 (0,4 m / 1 m)',
            54: 'Geod. tarkk. 4 (0,8 m / 2 m)',
            55: 'Geod. tarkk. 5 (2 m / 5 m)',
            56: 'Teor. tarkk. 1 (suunniteltu sijainti)',
            57: 'Teor. tarkk. 2 (asennustarkkuus)',
            58: 'Teor. tarkk. 3 (kohdetta siirretty)',
            59: 'Graaf. tarkk. 1 ( mk&gt;1:1000)',
            60: 'Graaf. tarkk. 2 (1:1000=&gt;mk&gt;1:10000)',
            61: 'Graaf. tarkk. 3 (1:10000=&gt;mk&gt;1:50000)',
            62: 'Graaf. tarkk. 4 (mk = &lt; 1:50000)',
            63: 'Menetelmätarkkuus'
        },
        'rakt_tyyp': {
            1: 'Poijuviitta',
            2: 'Jääpoiju',
            4: 'Viittapoiju',
            5: 'Suurviitta',
            6: 'Fasadivalo',
            7: 'Levykummeli',
            8: 'Helikopteritasanne',
            9: 'Radiomasto',
            10: 'Vesitorni',
            11: 'Savupiippu',
            12: 'Tutkatorni',
            13: 'Kirkontorni',
            14: 'Suurpoiju',
            15: '"Reunakummeli"',
            16: 'Kompassintarkistuspaikka',
            17: 'Rajamerkki',
            18: 'Rajalinjamerkki',
            19: 'Kanavan reunavalo',
            20: 'Torni'
        },
        'ty_jnr': {
            0: 'Tuntematon',
            1: 'Merimajakka',
            2: 'Sektoriloisto',
            3: 'Linjamerkki',
            4: 'Suuntaloisto',
            5: 'Apuloisto',
            6: 'Muu merkki',
            7: 'Reunamerkki',
            8: 'Tutkamerkki',
            9: 'Poiju',
            10: 'Viitta',
            11: 'Tunnusmajakka',
            13: 'Kummeli'
        },
        'pako_tyyp': {
            0: 'Tuntematon',
            1: 'Valon keskus',
            2: 'Huippu',
            3: 'Yläreunan keskus',
            4: 'Alareunan keskus',
            5: 'Rakenteen keskus',
            6: 'Maastoon merkitty'
        },
        'pata_tyyp': {
            0: 'Tuntematon',
            51: 'Mitattu geodeettisesti',
            52: 'GPS-mittaus',
            53: 'DGPS-paikannus',
            54: 'Decca-paikannus',
            55: 'Syledis-paikannus',
            56: 'Trisponder-paikannus',
            57: 'Autotracker (laser)',
            58: 'Takymetripaikannus',
            59: 'Teodoliittiohjaus',
            60: 'Opt. paik. sekstantilla',
            61: 'Graaf. paik. kartalta',
            62: 'Ilmakuvaus',
            63: 'Teoreettinen määritys',
            64: 'Muu kun edellä mainittu',
            65: 'RTK-GPS-mittaus'
        },
        'toti_tyyp': {
            0: 'Tuntematon',
            1: 'Jatkuva',
            2: 'Toimii tarvittaessa',
            3: 'Poistettu käytöstä',
            4: 'Rajoitettu toiminta-aika',
            5: 'Väliaikainen'
        },
        'tutkaheij': {
            1: '5-soppi',
            2: 'Speckter-heijastin',
            4: '6-soppi',
            5: '3-soppi',
            6: '4-soppi'
        }
    },
    'vesivaylatiedot:tutkamajakat': {
        'tunnuss': {
            0: 'Tuntemat./Okänd',
            1: 'MORSE B: _...',
            2: 'MORSE C: _._.',
            3: 'MORSE D: _..',
            4: 'MORSE G: _ _ .',
            5: 'MORSE K: _._',
            6: 'MORSE M: _ _',
            7: 'MORSE N: _.',
            8: 'MORSE O: _ _ _',
            9: 'MORSE Q: _ _._',
            10: 'MORSE T: _',
            11: 'MORSE X: _.._',
            12: 'MORSE Y: _._ _',
            13: 'MORSE Z: _ _ ..',
            14: 'MORSE Ö: _ _ _.',
            15: 'MORSE /: _.._.'
        },
        'lajis': {
            1: 'Jatkuvalähetteinen',
            2: 'Pyyhkivätaajuinen',
            3: 'Muuttuvalähetteinen'
        },
        'malli': {
            1: 'Ins.tsto Ylinen TM-4, X',
            2: 'Ins.tsto Ylinen TM-7, X',
            3: 'Ins.tsto Ylinen TMS-2, S',
            4: 'AEI Marconi Seawatch 300, X',
            5: 'AGA-Ericon, X/S',
            6: 'Ericon MK II X/S',
            7: 'Tideland SeaBeacon 2Sys5 X/S',
            8: 'PharosMarine Phalcon-2000 X/S',
            9: 'SeaBeacon 2 System 6'
        }
    },
    'vesivaylatiedot:vaylat': {
        'merial_nr': {
            0: 'Tuntematon',
            1: 'Perämeri',
            2: 'Selkämeri',
            3: 'Ahvenanmeri',
            4: 'Saaristomeri',
            5: 'Suomenlahti',
            6: 'Itämeri',
            7: 'Saimaan järvialue',
            8: 'Päijänteen järvialue',
            9: 'Kokemäenjoen vesistö',
            10: 'Oulujärvi',
            11: 'Sotkamon järvet',
            12: 'Kuhmon järvet',
            13: 'Kuusamon järvet',
            14: 'Kiantajärvi',
            15: 'Simojärvi',
            16: 'Lokka-Porttipahta',
            17: 'Kemijärvi',
            18: 'Inarinjärvi',
            19: 'Nitsijärvi',
            20: 'Miekkojärvi',
            21: 'Tornionjoki',
            22: 'Ähtärinjärvi',
            23: 'Lappajärvi',
            24: 'Pyhäjärvi',
            25: 'Lohjanjärvi'
        },
        'valaistus': {
            0: 'Tuntematon',
            1: 'Valaistu',
            2: 'Valaisematon'
        },
        'vaylalaji': {
            1: 'Meriväylä',
            2: 'Sisävesiväylä'
        },
        'tila': {
            1: 'Vahvistettu (Vahv.)',
            2: 'Aihio (Aih.)',
            3: 'Muutoksen alainen (Muut. ala.)',
            4: 'Muutosaihio (Muut. aih.)',
            5: 'Poiston alainen (Poist. aih.)',
            6: 'Poistettu (Poist.)'
        }
    },
    'vesivaylatiedot:vaylaalueet': {
        'laatulk': {
            0: 'Tuntematon',
            1: 'Laatuluokka 1',
            2: 'Laatuluokka 2',
            3: 'Laatuluokka 3'
        },
        'merk_laji': {
            0: 'Tuntematon',
            1: 'Lateraali',
            2: 'Kardinaali'
        },
        'vayalue_ty': {
            1: 'Navigointialue',
            2: 'Ankkurointialue',
            3: 'Ohitus- ja kohtaamisalue',
            4: 'Satama-allas',
            5: 'Kääntöallas',
            6: 'Kanava',
            7: 'Rannikkoliikenteen alue',
            8: 'Veneilyn runkoväylä',
            9: 'Erikoisalue',
            10: 'Sulku',
            11: 'Varmistettu lisäalue',
            12: 'HELCOM-alue',
            13: 'Luotsin otto- ja jättöalue'
        },
        'tila': {
            1: 'Vahvistettu (Vahv.)',
            2: 'Aihio (Aih.)',
            3: 'Muutoksen alainen (Muut. ala.)',
            4: 'Muutosaihio (Muut. aih.)',
            5: 'Poiston alainen (Poist. aih.)',
            6: 'Poistettu (Poist.)'
        }
    },
    'vesivaylatiedot:vesiliikennemerkit': {
        'vayla_attribuutit': {
            SELOSTE_AL: 'Alkamispaikan seloste',
            MERIAL_NR: 'Merialueen numero',
            KULKUSYV2: 'Väylän virallinen kulkusyvyys 2 [m]',
            KULKUSYV3: 'Väylän virallinen kulkusyvyys 3 [m]',
            KULKUSYV1: 'Väylän virallinen kulkusyvyys 1 [m]',
            VAYLALAJI: 'Väylälaji',
            VALAISTUS: 'Väylän valaistus',
            TILA: 'Väylän tila',
            VAY_NIMIRU: 'Väylän nimi ruotsiksi',
            VAY_NIMISU: 'Väylän nimi suomeksi',
            JNRO: 'Väylän tunnus (ID)',
            SELOSTE_PA: 'Päättymispaikan seloste',
            DIAARINRO: 'Väyläpäätöksen diaarinumero',
            VAHV_PVM: 'Väyläpäätöksen vahvistamispäivä',
            VAYLA_LK: 'Väyläluokka',
            IRROTUS_PVM: 'Kohteen julkaisupäivämäärä',
            GEOMETRY: 'Geometriakenttä'
        },
        'tklnumero': {
            0: 'Tuntematon',
            51: 'Geod. tarkk. 1 (0,12 m / 0,3 m)',
            52: 'Geod. tarkk. 2 (0,2 m / 0,5 m)',
            53: 'Geod. tarkk. 3 (0,4 m / 1 m)',
            54: 'Geod. tarkk. 4 (0,8 m / 2 m)',
            55: 'Geod. tarkk. 5 (2 m / 5 m)',
            56: 'Teor. tarkk. 1 (suunniteltu sijainti)',
            57: 'Teor. tarkk. 2 (asennustarkkuus)',
            58: 'Teor. tarkk. 3 (kohdetta siirretty)',
            59: 'Graaf. tarkk. 1 ( mk&gt;1:1000)',
            60: 'Graaf. tarkk. 2 (1:1000=&gt;mk&gt;1:10000)',
            61: 'Graaf. tarkk. 3 (1:10000=&gt;mk&gt;1:50000)',
            62: 'Graaf. tarkk. 4 (mk = &lt; 1:50000)',
            63: 'Menetelmätarkkuus'
        },
        'pako_tyyp': {
            0: 'Tuntematon',
            1: 'Valon keskus',
            2: 'Huippu',
            3: 'Yläreunan keskus',
            4: 'Alareunan keskus',
            5: 'Rakenteen keskus',
            6: 'Maastoon merkitty'
        },
        'pata_tyyp': {
            0: 'Tuntematon',
            51: 'Mitattu geodeettisesti',
            52: 'GPS-mittaus',
            53: 'DGPS-paikannus',
            54: 'Decca-paikannus',
            55: 'Syledis-paikannus',
            56: 'Trisponder-paikannus',
            57: 'Autotracker (laser)',
            58: 'Takymetripaikannus',
            59: 'Teodoliittiohjaus',
            60: 'Opt. paik. sekstantilla',
            61: 'Graaf. paik. kartalta',
            62: 'Ilmakuvaus',
            63: 'Teoreettinen määritys',
            64: 'Muu kun edellä mainittu',
            65: 'RTK-GPS-mittaus'
        },
        'vlm_laji': {
            0: 'Tuntematon',
            1: 'Ankkurin käyttökielto',
            2: 'Pysäköimiskielto',
            3: 'Kiinnittymiskielto',
            4: 'Ohittamiskielto',
            5: 'Kohtaamiskielto',
            6: 'Aallokon aiheuttamisen kielto',
            7: 'Vesihiihtokielto',
            8: 'Purjelautailukielto',
            9: 'Aluksen kulku moottorilla kielletty',
            10: 'Vesiskootterilla ajo kielletty',
            11: 'Nopeusrajoitus',
            12: 'Pysähtymismerkki',
            13: 'Yleinen varoitusmerkki',
            14: 'Annettava äänimerkki',
            15: 'Rajoitettu alikulkukorkeus',
            16: 'Rajoitettu kulkusyvyys',
            17: 'Rajoitettu kulkuleveys',
            18: 'Voimakas virtaus',
            19: 'Väylän reuna',
            20: 'Varoitus uimapaikasta',
            21: 'Otettava yhteys radiopuhelimella',
            22: 'Pysäköiminen sallittu',
            23: 'Kiinnittyminen sallittu',
            24: 'Ilmajohto',
            25: 'Puhelin',
            26: 'Lauttaväylän risteäminen, lossi',
            27: 'Lauttaväylän risteäminen, lautta',
            28: 'Mahdollisuus radiopuhelinyhteyteen',
            29: 'Juomavesipiste',
            30: 'Kiellon, määräyksen tai rajoituksen päättyminen',
            31: 'Kaapelitaulu',
            32: 'Johtotaulu',
            33: 'Suuntamerkki /alempi',
            34: 'Suuntamerkki /ylempi'
        },
        'vlm_tyyppi': {
            0: 'Tuntematon',
            1: 'Kieltomerkki',
            2: 'Määräys- tai rajoitusmerkki',
            3: 'Tiedotusmerkki',
            4: 'Kaapeli- tai johtotaulu',
            5: 'Suuntamerkki',
            6: 'Valo-opaste'
        }
    }
};
