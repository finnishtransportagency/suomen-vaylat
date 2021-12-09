const fi = {
    language: {
        languageSelection: {
            fi: 'FI',
            en: 'EN',
            sv: 'SV'
        }
    },
    title: 'Suomen Väylät',
    tooltips: {
        layerlist: {
            filter: 'Suodata',
            opacity: 'Opasiteetti',
        },
        searchButton: 'Osoitehaku',
        layerlistButton: 'Tasovalikko',
        fullscreenButton: 'Koko näyttö',
        legendHeader: 'Tällä zoom-tasolla näkyvissä olevat aineistot ja niiden selitteet',
        myLocButton: 'Oma sijainti',
        zoomExpand: 'Laajenna',
        zoomIn: 'Lähennä',
        zoomOut: 'Loitonna',
        drawingtools: {
            drawingtoolsButton: 'Piirtotyökalut',
            circle: 'Ympyrä',
            square: 'Neliö',
            box: 'Laatikko',
            linestring: 'Viiva',
            polygon: 'Monikulmio',
            erase: 'Tyhjennä'
        },
        share: 'Jaa sivu',
        shareTheme: 'Jaa teema',
        metadata: 'Näytä tason metadata',
        showPageInfo: 'Näytä sivun info',
        showUserGuide: 'Näytä käyttöohje',
    },
    gfi: {
        title: 'Kohdetiedot',
        close: 'Sulje',
        additionalInfo: 'Lisätiedot',
        gfiLocation: 'Lähennä kohteeseen',
        target: 'Kohde'
    },
    general: {
        close: 'Sulje',
        warning: 'Varoitus!',
        continue: 'Jatka',
        cancel: 'Peruuta',
        dontShowAgain: 'Älä näytä uudelleen',
        ok: 'OK'
    },
    multipleLayersWarning: 'Olet lisäämässä kartalle 10 tai enemmän karttatasoa ja se saattaa vaikuttaa palvelun suorituskykyyn',
    appGuide: {
        title: 'Käyttöohje',
        modalContent: {
            upperBar: {
                title: 'Yläpalkin toiminnot',
                content: {
                    0: {
                        title: 'Palaa aloitusnäkymään',
                        text: 'Aloitusnäkymä on valmiiksi määritelty näkymä, jossa näytetään koko Suomen alueelta vesiväylät, rataverkko ja tieverkko.'
                    },
                    1: {
                        title: 'Jaa sivu',
                        text: 'Kartan nykyisen näkymän voi jakaa linkillä suoraan valittuun palveluun tai kopioimalla linkin. Näkymässä säilytetään kohdistus, zoom-taso sekä valitut aineistot ja valittu teema.'
                    },
                    2: {
                        title: 'Info',
                        text: 'Info-napin takaa löytyy tietoa sovelluksesta, käyttöohjeet sekä yhteystiedot esimerkiksi palautteen lähettämistä varten.'
                    },
                    3: {
                        title: 'Kieli',
                        text: 'Karttapalvelun kieleksi voi valita suomen, ruotsin tai englannin.'
                    }
                }
            },
            mapLevelMenu: {
                title: 'Karttatasovalikko',
                subTitle: 'Karttatasovalikko avautuu vasemmasta yläreunasta. Valittavissa on 3 välilehteä',
                tabsContent: {
                    materList: 'Aineistolistausta voi suodattaa aiheittain suodatin-painikkeen takaa. Karttatasoa voi hakea nimellä kirjoittamalla vähintään 3 kirjainta haku-kenttään.',
                    themeLayerSelection: 'Teeman valinta asettaa näkyviin teemaan määritellyt karttatasot\n' +
                        'ja avaa valikon teemaan liittyvien kartta-aineistojen valintaan.\n' +
                        'Osalla kartta-aineistoista on oma tyylinsä teemalle.\n' +
                        'Teemoja voi olla auki vain yksi kerrallaan. Teeman ollessa valittuna\n' +
                        'voi Kaikki tasot -valikosta valita myös muita kartta-aineistoja näkyviin\n' +
                        'kuin mitä teemaan on määritelty. Teema suljetaan kartan yläreunasta\n' +
                        'löytyvästä teema-merkistä.Teeman valinta asettaa näkyviin teemaan määritellyt\n' +
                        'karttatasot ja avaa valikon teemaan liittyvien kartta-aineistojen valintaan.\n' +
                        'Osalla kartta-aineistoista on oma tyylinsä teemalle. Teemoja voi olla auki\n' +
                        'vain yksi kerrallaan. Teeman ollessa valittuna voi Kaikki tasot -valikosta\n' +
                        'valita myös muita kartta-aineistoja näkyviin kuin mitä teemaan on määritelty.\n' +
                        'Teema suljetaan kartan yläreunasta löytyvästä teema-merkistä.',
                    selectedLayers: 'Lista kartalle valituista karttatasoista. Tasojen järjestystä voi vaihtaa raahaamalla niitä oikean reunan ikonista.\n' +
                        'Läpinäkyvyyttä voi säätää liukusäätimellä ja\n' +
                        'tason valinnan voi poistaa ruksista.'
                },
            },
            search: {
                title: 'Haku',
                content: 'Haku avautuu kartan oikeaan yläkulmaan vasemman reunan suurennuslasi-painikkeesta. ' +
                    'Haku-toiminnolla voi hakea teitä ja ja osoitteita valitsemalla alasvetovalikosta ' +
                    'käytettävän haun. Hakutuloksen voi poistaa kartalta painamalla haku-kentän roskakoria.'
            },
            measureTool: {
                title: 'Mittaustyökalut',
                content: 'Mittaustyökalut avautuvat vasemman reunan piirto-ikonista.\n' +
                    'Työkaluilla voi mitata pituutta tai pinta-alaa. mittaustulokset saa poistettua kartalta oranssilla kumi-painikkeella.'
            },
            setFullScreen: {
                title: 'Laajenna',
                content: 'Laajenna-painikkeella voi laajentaa\n' +
                    'Suomen Väylät -sovelluksen täyttämään\n' +
                    'koko näyttöruudun.'
            },
            zoomBar: {
                title: 'Selitteet / zoom-palkki',
                content: 'Zoom-tason ja kartalla sillä zoom-tasolla näkyvät karttatasot selitteineen\n' +
                    'saa avattua oikean alareunan selite-ikonista. Karttatasot on listattu päällimmäinen\n' +
                    'ensimmäisenä. Valitsemalla zoom-palkista toisen mittakaavan,\n' +
                    'siirrytään valitulle lähestymistasolle.'
            }
        }
    },
    appInfo: {
        title: 'Sovelluksen tiedot',
        headingText: 'Suomen Väylät -karttapalvelu kokoaa yhteen Väyläviraston avoimet, ' +
            'eri väylämuotoihin liittyvät aineistot. ' +
            'Palvelun kautta väylätietoja halutaan kuvata mahdollisimman ' +
            'sujuvasti, näkyvästi, ajantasaisesti ja monipuolisesti ' +
            'erilaisille käyttäjäryhmille ja -tarpeille.',
        mainText: 'Väyläviraston lakisääteinen tehtävä on ' +
            'vastata Suomen tie-, rataverkosta sekä vesiväylistä. ' +
            'Väylävirasto hallinnoi, hyödyntää sekä jakaa ' +
            'mittavan määrän väyläverkkoihin liittyviä tietoja. ' +
            'Väyliin liittyvät sijainti-, ominaisuus- ja kuntotiedot ' +
            'sekä väylähankkeiden suunnittelu - ja toteumatiedot, ovat ' +
            'perustana monen toiminnan suunnittelulle, päätöksenteolle ja ' +
            'seurannalle. Väyläviraston toiminnan myötä syntyvät tietoaineistot ' +
            'ja niiden perusteella tekemät tilastot ja tutkimukset pidetään ' +
            'lähtökohtaisesti julkisena tietona, joita luovutetaan muiden ' +
            'yhteiskunnan toimijoiden ja kansalaisten käyttöön. ' +
            'Julkinen tieto luovutetaan muiden toimijoiden käyttöön avoimena ' +
            'datana aina silloin, kun se on mahdollista.'
    },
    search: {
        types: {
            address: 'Osoitehaku',
            vkm: 'Tiehaku'
        },
        vkm: {
            tie: 'Tienumero',
            osa: 'Tieosa',
            ajorata: 'Ajorata',
            etaisyys: 'Etäisyys (m)',
            error: {
                title: 'Tiehaku epäonnistui',
                text: 'Tarkista seuraavat virheet:'
            }
        },
        address: {
            address: 'Opastinsilta 12 Helsinki',
            error: {
                title: 'Osoitehaku',
                text: 'Tuloksia ei löytynyt osoitehaulla.'
            }
        }
    },
    layerlist: {
        layerlistLabels: {
            allLayers: 'Kaikki tasot' ,
            themeLayers: 'Teemakartat',
            selectedLayers: 'Valitut tasot',
            mapLayers: 'Karttatasot',
            backgroundMaps: 'Taustakartat',
            selectAll: 'Valitse kaikki',
            show: 'Näytä',
            filterOrSearchLayers: 'Suodata tai hae tasoja',
            filterByType: 'Suodata tyypeittäin',
            searchForLayers: 'Hae karttatasoja',
            clearFilters: 'Tyhjennä suodatinvalinnat',
            searchResults: 'Hakutulokset',
            clearSelectedMapLayers: 'Tyhjennä valitut karttatasot',
            clearSelectedBackgroundMaps: 'Tyhjennä valitut taustakartat',
            noSearchResults: 'Ei hakutuloksia',
            typeAtLeastThreeCharacters: 'Syötä vähintaan 3 kirjainta'
        },
        selectedLayers: {
            layerVisible: 'Taso näkyvillä',
            zoomInToShowLayer: 'Lähennä nähdäksesi taso',
            zoomOutToShowLayer: 'Loitonna nähdäksesi taso',
            opacity: 'Läpinäkyvyys'
        }
    },
    themelayerlist: {
        0: {
            title: 'Hankekartta',
            description: 'Kartalla esitetään Väyläviraston investointihankkeet ja toteutukseen tähtäävät hankesuunnittelukohteet.'
        },
        1: {
            title: 'Päällysteiden kuntokartta',
            description: null
        },
        2: {
            title: 'Siltarajoituskartta',
            description: 'Kartalla on esitetty painorajoitetut sillat ja alikulkujen rajoitukset. Rajoituksia voi poistua ja tulla lisää, joten karttaa kannattaa tarkastella usein. Muistakaa tarkistaa mahdolliset rajoitukset myös kunnista ja yksityisteiden tiekunnilta.'
        },
        3: {
            title: 'Tienumerokartta',
            description: null
        },
        4: {
            title: 'Rataverkon kuntokartta',
            description: null
        },
        5: {
                title: 'TEN-T verkosto',
                description: 'TEN-T-verkosto koostuu kahdesta tasosta: vuoteen 2030 mennessä rakennettavasta ydinverkosta (core network) ja vuoteen 2050 mennessä rakennettavasta kattavasta verkosta (comprehensive network). TEN-T ydinverkko keskittyy tärkeimpiin yhteyksiin ja solmukohtiin. Ydinverkon toteuttamista edistää käytäviin perustuva lähestymistapa. TEN-T-verkko kattaa kaikki liikennemuodot: maantie-, ilma-, sisävesi-, meri- sekä liikennemuotojen yhdistelyn mahdollistavat alustat.'
        }
    },
    metadata: {
        title: '{0} -karttatason metatiedot',
        // Copied from Oskari https://github.com/oskariorg/oskari-frontend/blob/master/bundles/catalogue/metadataflyout/resources/locale/fi.js
        heading: {
            abstractTextService: 'Palvelun tiivistelmä',
            abstractTextData: 'Aineiston tiivistelmä',
            accessConstraint: 'Saantirajoitteet',
            citationDate: 'Päivämäärä',
            classification: 'Turvaluokittelu',
            descriptiveKeyword: 'Avainsanat',
            distributionFormat: 'Jakeluformaatti',
            fileIdentifier: 'Tiedostotunniste',
            legalConstraint: 'Lailliset rajoitteet',
            lineageStatement: 'Kuvaus aineiston historiasta',
            metadataCharacterSet: 'Metatiedoissa käytetty merkistö',
            metadataDateStamp: 'Metatiedon päiväys',
            metadataLanguage: 'Metatiedon kieli',
            metadataOrganisation: 'Organisaation nimi',
            metadataStandardName: 'Metatietostandardin nimi',
            metadataStandardVersion: 'Metatietostandardin versio',
            onlineResource: 'Verkko-osoite',
            operatesOn: 'Liitännäisresurssi',
            otherConstraint: 'Muut rajoitteet',
            reportConformance: 'Sääntöjenmukaisuus',
            responsibleParty: 'Vastuutaho',
            resourceIdentifier: 'Yksilöivä resurssitunniste',
            resourceLanguage: 'Resurssin kieli',
            scopeCode: 'Resurssin tyyppi',
            serviceType: 'Paikkatietopalvelun tyyppi',
            spatialRepresentationType: 'Sijaintitiedon esitystapa',
            spatialResolution: 'Sijaintitiedon erotuskyky',
            temporalExtent: 'Ajallinen kattavuus',
            topicCategory: 'Aiheluokka',
            useLimitation: 'Käyttöehdot',
            absoluteExternalPositionalAccuracy: 'Absoluuttinen sijaintitarkkuus',
            accuracyOfTimeMeasurement: 'Ajallisen mittauksen oikeellisuus',
            completenessCommission: 'Ylimääräinen tieto',
            completenessOmission: 'Puuttuva tieto',
            conceptualConsistency: 'Käsitteellinen eheys',
            domainConsistency: 'Arvojoukkoeheys',
            formatConsistency: 'Formaattieheys',
            griddedDataPositionalAccuracy: 'Rasteritiedon sijaintitarkkuus',
            nonQuantitativeAttributeAccuracy: 'Kuvailevan ominaisuustiedon oikeellisuus',
            quantitativeAttributeAccuracy: 'Mitattavan ominaisuustiedon oikeellisuus',
            relativeInternalPositionalAccuracy: 'Suhteellinen sijaintitarkkuus',
            temporalConsistency: 'Ajallinen eheys',
            temporalValidity: 'Ajanmukaisuus',
            thematicClassificationCorrectness: 'Luokittelun oikeellisuus',
            topologicalConsistency: 'Topologinen eheys'
        },
        /// Copied from Oskari https://github.com/oskariorg/oskari-frontend/blob/master/bundles/catalogue/metadataflyout/resources/locale/fi.js
        qualityContent: {
            qualityPassTrue: 'Aineisto on sääntöjenmukainen.',
            qualityPassFalse: 'Aineisto ei ole sääntöjenmukainen.',
            nameOfMeasure: 'Laatumittarin nimi',
            citationTitle: 'Nimi',
            measureIdentificationCode: 'Laatumittarin tunniste koodi',
            measureIdentificationAuthorization: 'Laatumittarin tunniste tunnistautuminen',
            measureDescription: 'Laatumittarin kuvailu',
            evaluationMethodType: 'Arviointimenetelmän tyyppi',
            evaluationMethodDescription: 'Arviointimenetelmän kuvailu',
            evaluationProcedure: 'Arviointimenettelyn viitetiedot',
            dateTime: 'Päivämäärä ja aika',
            specification: 'Tietomäärittelyn viitetiedot',
            explanation: 'Selitys',
            valueType: 'Laatutuloksen tyyppi',
            valueUnit: 'Laatutuloksen yksikkö',
            errorStatistic: 'Tilastollinen menetelmä',
            value: 'Arvo',
            conformanceResult: 'Vaatimuksenmukaisuus',
            quantitativeResult: 'Mitattu laatutulos'
        },
        // Copied from Oskari https://github.com/oskariorg/oskari-frontend/blob/master/bundles/catalogue/metadataflyout/resources/locale/fi.js
        codeLists: {
            'gmd:MD_CharacterSetCode': {
                'ucs2': {
                    'label': 'UCS2',
                    'description': '16-bit fixed size Universal Character Set, based on ISO/IEC 10646'
                },
                'ucs4': {
                    'label': 'UCS4',
                    'description': '32-bit fixed size Universal Character Set, based on ISO/IEC 10646'
                },
                'utf7': {
                    'label': 'UTF7',
                    'description': '7-bit variable size UCS Transfer Format, based on ISO/IEC 10646'
                },
                'utf8': {
                    'label': 'UTF8',
                    'description': '8-bit variable size UCS Transfer Format, based on ISO/IEC 10646'
                },
                'utf16': {
                    'label': 'UTF16',
                    'description': '16-bit variable size UCS Transfer Format, based on ISO/IEC 10646'
                },
                '8859part1': {
                    'label': '8859 Part 1',
                    'description': 'ISO/IEC 8859-1, Information technology - 8-bit single byte coded graphic character sets - Part 1 : Latin alphabet No.1'
                },
                '8859part2': {
                    'label': '8859 Part 2',
                    'description': 'ISO/IEC 8859-2, Information technology - 8-bit single byte coded graphic character sets - Part 2 : Latin alphabet No.2'
                },
                '8859part3': {
                    'label': '8859 Part 3',
                    'description': 'ISO/IEC 8859-3, Information technology - 8-bit single byte coded graphic character sets - Part 3 : Latin alphabet No.3'
                },
                '8859part4': {
                    'label': '8859 Part 4',
                    'description': 'ISO/IEC 8859-4, Information technology - 8-bit single byte coded graphic character sets - Part 4 : Latin alphabet No.4'
                },
                '8859part5': {
                    'label': '8859 Part 5',
                    'description': 'ISO/IEC 8859-5, Information technology - 8-bit single byte coded graphic character sets - Part 5 : Latin/Cyrillic alphabet'
                },
                '8859part6': {
                    'label': '8859 Part 6',
                    'description': 'ISO/IEC 8859-6, Information technology - 8-bit single byte coded graphic character sets - Part 6 : Latin/Arabic alphabet'
                },
                '8859part7': {
                    'label': '8859 Part 7',
                    'description': 'ISO/IEC 8859-7, Information technology - 8-bit single byte coded graphic character sets - Part 7 : Latin/Greek alphabet'
                },
                '8859part8': {
                    'label': '8859 Part 8',
                    'description': 'ISO/IEC 8859-8, Information technology - 8-bit single byte coded graphic character sets - Part 8 : Latin/Hebrew alphabet'
                },
                '8859part9': {
                    'label': '8859 Part 9',
                    'description': 'ISO/IEC 8859-9, Information technology - 8-bit single byte coded graphic character sets - Part 9 : Latin alphabet No.5'
                },
                '8859part10': {
                    'label': '8859 Part 10',
                    'description': 'ISO/IEC 8859-10, Information technology - 8-bit single byte coded graphic character sets - Part 10 : Latin alphabet No.6'
                },
                '8859part11': {
                    'label': '8859 Part 11',
                    'description': 'ISO/IEC 8859-11, Information technology - 8-bit single byte coded graphic character sets - Part 11 : Latin/Thai alphabet'
                },
                '8859part13': {
                    'label': '8859 Part 13',
                    'description': 'ISO/IEC 8859-13, Information technology - 8-bit single byte coded graphic character sets - Part 13 : Latin alphabet No.7'
                },
                '8859part14': {
                    'label': '8859 Part 14',
                    'description': 'ISO/IEC 8859-14, Information technology - 8-bit single byte coded graphic character sets - Part 14 : Latin alphabet No.8 (Celtic)'
                },
                '8859part15': {
                    'label': '8859 Part 15',
                    'description': 'ISO/IEC 8859-15, Information technology - 8-bit single byte coded graphic character sets - Part 15 : Latin alphabet No.9'
                },
                '8859part16': {
                    'label': '8859 Part 16',
                    'description': 'ISO/IEC 8859-16, Information technology - 8-bit single byte coded graphic character sets - Part 16 : Latin alphabet No.10'
                },
                'jis': {
                    'label': 'JIS',
                    'description': 'Japanese code set used for electronic transmission'
                },
                'shiftJIS': {
                    'label': 'Shift JIS',
                    'description': 'Japanese code set used on MS-DOS machines'
                },
                'eucJP': {
                    'label': 'EUC JP',
                    'description': 'Japanese code set used on UNIX based machines'
                },
                'usAscii': {
                    'label': 'US ASCII',
                    'description': 'United States ASCII code set (ISO 646 US)'
                },
                'ebcdic': {
                    'label': 'EBCDIC',
                    'description': 'IBM mainframe code set'
                },
                'eucKR': {
                    'label': 'EUC KR',
                    'description': 'Korean code set'
                },
                'big5': {
                    'label': 'Big 5',
                    'description': 'Traditional Chinese code set used in Taiwan, Hong Kong of China and other areas'
                },
                'GB2312': {
                    'label': 'GB2312',
                    'description': 'Simplified Chinese code set'
                }
            },
            'gmd:MD_ClassificationCode': {
                'unclassified': {
                    'label': 'Julkinen',
                    'description': 'Yleisesti tiedossa oleva tai tiedoksi saatavissa.'
                },
                'restricted': {
                    'label': 'Salassa pidettävä',
                    'description': 'Ei yleiseen tietoon tarkoitettu.'
                },
                'confidential': {
                    'label': 'Luottamuksellinen',
                    'description': 'Vain tietyn henkilön tai tiettyjen henkilöiden tietoon tarkoitettu.'
                },
                'secret': {
                    'label': 'Salainen',
                    'description': 'Erittäin arkaluontoista, salassa pidettävää tietoa. Vain tiettyjen harvojen tietoon tarkoitettu.'
                },
                'topSecret': {
                    'label': 'Erittäin salainen',
                    'description': 'Äärimmäisen arkaluonteinen, salassa pidettävä tieto.'
                }
            },
            'gmd:CI_DateTypeCode': {
                'creation': {
                    'label': 'Luonti',
                    'description': 'Resurssin laatimisajankohta.'
                },
                'publication': {
                    'label': 'Julkaisu',
                    'description': 'Resurssin julkistamisajankohta tai voimaantulopäivä.'
                },
                'revision': {
                    'label': 'Päivitys',
                    'description': 'Resurssin päivityksen, muokkauksen tai ylläpidon ajankohta.'
                }
            },
            'gmd:MD_RestrictionCode': {
                'copyright': {
                    'label': 'Tekijänoikeus',
                    'description': 'Yksinoikeus julkaista, tuottaa tai myydä kirjallista tai taiteellista teosta (ks. tarkemmin tekijänoikeuslaki).'
                },
                'patent': {
                    'label': 'Patentti',
                    'description': 'Yksinoikeus keksinnön tai löydön ammattimaiseen valmistamiseen, myymiseen, käyttämiseen tai lisensoimiseen.'
                },
                'patentPending': {
                    'label': 'Patenttia odottava',
                    'description': 'Patenttia odottava tuotettu tai myyty tuote.'
                },
                'trademark': {
                    'label': 'Tavaramerkki',
                    'description': 'Myytävissä tuotteissa oleva erityinen tunnusmerkki, jolla tuote pyritään erottamaan muiden alan toimijoiden tuotteista.'
                },
                'license': {
                    'label': 'Lisenssi',
                    'description': 'Virallinen lupa tehdä jotakin.'
                },
                'intellectualPropertyRights': {
                    'label': 'Immateriaalioikeudet',
                    'description': 'Oikeus taloudellisesti hyötyä luovuuden tuotteena syntyneestä aineettomasta resurssista sekä kontrolloida sen jakelua.'
                },
                'restricted': {
                    'label': 'Rajoitettu',
                    'description': 'Ei yleiseen tietoon tarkoitettu.'
                },
                'otherRestrictions': {
                    'label': 'Muut rajoitteet',
                    'description': 'Rajoituksia ei ole kirjattu.'
                }
            },
            'gmd:MD_ScopeCode': {
                'attribute': {
                    'label': 'Ominaisuus',
                    'description': 'Informaatio koskee ominaisuuden arvoa.'
                },
                'attributeType': {
                    'label': 'Ominaisuustyyppi',
                    'description': 'Informaatio koskee kohdetyypin ominaispiirrettä.'
                },
                'collectionHardware': {
                    'label': 'Laitteisto',
                    'description': 'Informaatio koskee laitteistoa.'
                },
                'collectionSession': {
                    'label': 'Istunto',
                    'description': 'Informaatio koskee istuntoa.'
                },
                'dataset': {
                    'label': 'Tietoaineisto',
                    'description': 'Informaatio koskee tietoaineistoa.'
                },
                'series': {
                    'label': 'Tietoaineistosarja',
                    'description': 'Informaatio koskee tietoaineistosarjaa.'
                },
                'nonGeographicDataset': {
                    'label': 'Muu kuin paikkatietoaineisto',
                    'description': 'Informaatio koskee muuta kuin paikkatietoaineistoa.'
                },
                'dimensionGroup': {
                    'label': 'Dimensioryhmä',
                    'description': 'Informaatio koskee dimensioryhmää.'
                },
                'feature': {
                    'label': 'Kohde',
                    'description': 'Informaatio koskee kohdetta.'
                },
                'featureType': {
                    'label': 'Kohdetyyppi',
                    'description': 'Informaatio koskaa kohdetyyppiä.'
                },
                'propertyType': {
                    'label': 'Property type',
                    'description': 'Information applies to a property type'
                },
                'fieldSession': {
                    'label': 'Maastotyöskentely',
                    'description': 'Informaatio koskee maastossa työskentelyä.'
                },
                'software': {
                    'label': 'Ohjelmisto',
                    'description': 'Informaatio koskee ohjelmistoa tai käskysarjaa.'
                },
                'service': {
                    'label': 'Palvelu',
                    'description': 'Informaatio koskee palvelua.'
                },
                'model': {
                    'label': 'Malli',
                    'description': 'Informaatio koskee olemassa olevan tai hypoteettisen objektin kopiota tai jäljennöstä.'
                },
                'tile': {
                    'label': 'Sijainnin osajoukko',
                    'description': 'Informaatio koskee sijainnin perusteella rajattua tietoaineiston osajoukkoa.'
                }
            },
            'gmd:MD_SpatialRepresentationTypeCode': {
                'vector': {
                    'label': 'Vektori',
                    'description': 'Paikkatiedon vektorimuotoinen esitystapa.'
                },
                'grid': {
                    'label': 'Rasteri',
                    'description': 'Paikkatiedon rasterimuotoinen esitystapa.'
                },
                'textTable': {
                    'label': 'Teksti- tai taulukkomuoto',
                    'description': 'Paikkatiedon teksti- tai taulukkomuotoinen esitystapa.'
                },
                'tin': {
                    'label': 'TIN',
                    'description': 'Epäsäännöllinen kolmioverkko.'
                },
                'stereoModel': {
                    'label': 'Stereomalli',
                    'description': 'Stereoparista muodostettu kolmiulotteinen vaikutelma.'
                },
                'video': {
                    'label': 'Video',
                    'description': 'Videotallenteen näkymä.'
                }
            },
            'gmd:MD_TopicCategoryCode': {
                'farming': {
                    'label': 'Maatalous',
                    'description': 'Kotieläinten kasvatus ja/tai kasvinviljely. Esim. maatalous, keinokastelu, plantaasi, paimennus, tuhoeläinten ja tautien vahingoittama sato, karja.'
                },
                'biota': {
                    'label': 'Eläin- ja kasvikunta',
                    'description': 'Kasvisto ja eläimistö luonnonympäristössä. Esim. villieläimet, kasvillisuus, biologia, ekologia, erämaa, merenelämä, kosteikko, kasvupaikka.'
                },
                'boundaries': {
                    'label': 'Rajat',
                    'description': 'Lakisääteiset maan alueiden kuvaukset, kuten poliittiset ja hallinnolliset rajat.'
                },
                'climatologyMeteorologyAtmosphere': {
                    'label': 'Ilmastotiede/meteorologia/ilmakehä',
                    'description': 'Ilmakehän prosessit ja ilmiöt. Esim. pilvipeite, säätila, ilmasto, ilmakehän tila, ilmastonmuutos, sadekehä.'
                },
                'economy': {
                    'label': 'Talous',
                    'description': 'Taloudellinen toimeliaisuus, taloudelliset olot ja työllisyys. Esim. tuotanto, työvoima, liikevaihto, kaupankäynti, teollisuus, turismi ja ekoturismi, metsätalous, kalastus, kaupallinen tai kotitarvemetsästys, luonnonvarojen, kuten mineraalien, öljyn ja maakaasun, etsintä ja hyväksikäyttö.'
                },
                'elevation': {
                    'label': 'Korkeus',
                    'description': 'Korkeus tai syvyys merenpinnasta. Esim. DEM, kaltevuus.'
                },
                'environment': {
                    'label': 'Ympäristö',
                    'description': 'Luonnonvarat, ympäristönsuojelu ja luonnonsuojelu. Esim. ympäristön saastuminen, jätteiden varastointi ja jätteenkäsittely, ympäristövaikutusten arviointi, ympäristöriskien valvonta, luonnonsuojelualue, maisema.'
                },
                'geoscientificInformation': {
                    'label': 'Geotieteet',
                    'description': 'Geotieteisiin liittyvää informaatiota. Esim. geofysikaaliset ominaisuudet ja prosessit, geologia, mineraalit, kallioperän koostumusta, rakennetta ja alkuperää tutkiva tiede, maanjäristysten riskit, vulkaaninen toiminta, maanvyöryt, painovoimaa koskeva tieto, maaperä, ikirouta, hydrogeologia, eroosio.'
                },
                'health': {
                    'label': 'Terveys',
                    'description': 'Terveys, terveyspalvelut, sosiaaliekologia ja turvallisuus. Esim. taudit ja sairaudet, terveyteen vaikuttavat tekijät, hygienia, päihderiippuvuus, mielenterveys, fyysinen terveys.'
                },
                'imageryBaseMapsEarthCover': {
                    'label': 'Kuvat/peruskartat/maanpeite',
                    'description': 'Peruskartat ja maanpeite, kuten esim. topografinen kartta ja luokittelematon kuva.'
                },
                'intelligenceMilitary': {
                    'label': 'Tiedustelu/puolustus',
                    'description': 'Sotilastukikohdat, puolustusrakenteet, sotilastoiminta.'
                },
                'inlandWaters': {
                    'label': 'Sisävedet',
                    'description': 'Sisävesikohteet, valumajärjestelmät ja niiden ominaispiirteet. Esim. joet, jäätiköt, suolajärvet, veden hyväksikäyttöä koskevat suunnitelmat, padot, virtaukset, tulvat, veden laatu, merikartat.'
                },
                'location': {
                    'label': 'Sijainti',
                    'description': 'Paikantamiseen liittyvä tieto tai palvelu. Esim. osoitteet, geodeettinen verkosto, tukipisteet, postialueet ja palvelut, paikannimet.'
                },
                'oceans': {
                    'label': 'Valtameret',
                    'description': 'Suolaisten vesimassojen (lukuunottamatta sisävesiä) ominaispiirteet. Esim. vuorovedet, tsunamit, rannikkoa koskevaa informaatiota, riutat.'
                },
                'planningCadastre': {
                    'label': 'Aluesuunnittelu/kiinteistöjärjestelmä',
                    'description': 'Maankäyttöön ja suunnitteluun liittyvää informaatiota.'
                },
                'society': {
                    'label': 'Yhteiskunta',
                    'description': 'Yhteiskuntaa ja kulttuuria kuvaavat ominaispiirteet. Esim. asutus, antropologia, arkeologia, koulutus, perinteiset uskomukset, tavat ja tottumukset, väestöä koskeva aineisto, virkistysalueet ja -toiminta, sosiaalisten vaikutusten arviointi, rikollisuus ja oikeudenkäyttö, väestölaskentaa koskevaa informaatiota.'
                },
                'structure': {
                    'label': 'Rakennelma',
                    'description': 'Keinotekoiset rakenteet. Esim. rakennukset, museot, kirkot, tehtaat, kodit, muistomerkit, kaupat, tornit.'
                },
                'transportation': {
                    'label': 'Liikenne',
                    'description': 'Ihmisten ja tavaroiden kuljetukseen käytetyt tavat. Esim. tiestö, lentokentät/kiitotiet, laivaväylät, tunnelit, merikartat, ajoneuvon tai aluksen sijainti, ilmailukartat, rautatiet.'
                },
                'utilitiesCommunication': {
                    'label': 'Johtoverkot/viestintä',
                    'description': 'Energia-, vesi- ja jätejärjestelmät sekä viestintäinfrastruktuuri ja -palvelut. Esim. vesivoimasähkö, geotermisen, aurinko- ja ydinenergian lähde, vedenpuhdistus ja -jakelu, jäteveden käsittely, sähkön ja maakaasun jakelu, tietoliikenne, teleliikenne, radio, viestintäverkko.'
                }
            }
        },
        // Copied from https://github.com/oskariorg/oskari-frontend/blob/master/bundles/framework/divmanazer/resources/locale/fi.js
        languages: {
            af: 'afrikaans',
            ak: 'akan',
            am: 'amhara',
            ar: 'arabia',
            az: 'azeri',
            be: 'valkovenäjä',
            bg: 'bulgaria',
            bm: 'bambara',
            bn: 'bengali',
            bo: 'tiibet',
            br: 'bretoni',
            bs: 'bosnia',
            ca: 'katalaani',
            cs: 'tšekki',
            cy: 'kymri',
            da: 'tanska',
            de: 'saksa',
            dz: 'dzongkha',
            ee: 'ewe',
            el: 'kreikka',
            en: 'englanti',
            eo: 'esperanto',
            es: 'espanja',
            et: 'viro',
            eu: 'baski',
            fa: 'farsi',
            ff: 'fulani',
            fi: 'suomi',
            fo: 'fääri',
            fr: 'ranska',
            fy: 'länsifriisi',
            ga: 'iiri',
            gd: 'gaeli',
            gl: 'galicia',
            gu: 'gudžarati',
            ha: 'hausa',
            he: 'heprea',
            hi: 'hindi',
            hr: 'kroatia',
            hu: 'unkari',
            hy: 'armenia',
            ia: 'interlingua',
            id: 'indonesia',
            ig: 'igbo',
            is: 'islanti',
            it: 'italia',
            ja: 'japani',
            ka: 'georgia',
            ki: 'kikuju',
            kk: 'kazakki',
            kl: 'kalaallisut',
            km: 'khmer',
            kn: 'kannada',
            ko: 'korea',
            ks: 'kašmiri',
            kw: 'korni',
            ky: 'kirgiisi',
            lb: 'luxemburg',
            lg: 'ganda',
            ln: 'lingala',
            lo: 'lao',
            lt: 'liettua',
            lu: 'katanganluba',
            lv: 'latvia',
            mg: 'malagassi',
            mk: 'makedonia',
            ml: 'malajalam',
            mn: 'mongoli',
            mr: 'marathi',
            ms: 'malaiji',
            mt: 'malta',
            my: 'burma',
            nb: 'norjan bokmål',
            nd: 'pohjois-ndebele',
            ne: 'nepali',
            nl: 'hollanti',
            nn: 'norjan nynorsk',
            om: 'oromo',
            or: 'orija',
            os: 'osseetti',
            pa: 'pandžabi',
            pl: 'puola',
            ps: 'paštu',
            pt: 'portugali',
            qu: 'ketšua',
            rm: 'retoromaani',
            rn: 'rundi',
            ro: 'romania',
            ru: 'venäjä',
            rw: 'ruanda',
            se: 'pohjoissaame',
            sg: 'sango',
            si: 'sinhala',
            sk: 'slovakki',
            sl: 'sloveeni',
            sn: 'šona',
            so: 'somali',
            sq: 'albania',
            sr: 'serbia',
            sv: 'ruotsi',
            sw: 'swahili',
            ta: 'tamili',
            te: 'telugu',
            th: 'thai',
            ti: 'tigrinja',
            tn: 'tswana',
            to: 'tonga',
            tr: 'turkki',
            ts: 'tsonga',
            ug: 'uiguuri',
            uk: 'ukraina',
            ur: 'urdu',
            uz: 'uzbekki',
            vi: 'vietnam',
            yi: 'jiddiš',
            yo: 'joruba',
            zh: 'kiina',
            zu: 'zulu'
        }
    },
    legend: {
        title: 'Kartalla nyt',
        nolegend: 'Ei karttaselitettä',
        noSelectedLayers: 'Karttatasoja ei valittuna'
    },
    share: {
        title: 'Jaa sivu',
        shareTexts: {
            title: 'Suomen Väylät - karttalinkki',
            emailBody: 'Karttalinkki: ',
            copiedToClipboard: 'Kopioitu leikepöydälle'
        },
        tooltips: {
            clipboard: 'Kopioi leikepöydälle',
            email: 'Lähetä sähköpostilla',
            facebook: 'Jaa Facebookissa',
            twitter: 'Jaa Twitterissä',
            linkedin: 'Jaa LinkedInissä',
            whatsapp: 'Jaa WhatsAppissa',
            telegram: 'Jaa Telegrammissa',
        }
    }
}

export default fi;