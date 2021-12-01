const sv = {
    language: {
        languageSelection: {
            fi: 'FI',
            en: 'EN',
            sv: 'SV'
        }
    },
    title: 'Suomen Väylät SV',
    tooltips: {
        layerlistButton: 'Tasovalikko',
        searchButton: 'Haku',
        legendButton: 'Legenda',
        fullscreenButton: 'Koko näyttö',
        myLocButton: 'Oma sijainti',
        zoomExpand: 'Laajenna',
        zoomIn: 'Lähennä',
        zoomOut: 'Loitonna',
        opacity: 'Läpinäkyvyys',
        drawingtools: {
            drawingtoolsButton: 'Piirtotyökalut',
            circle: 'Ympyrä',
            square: 'Neliö',
            box: 'Laatikko',
            linestring: 'Viiva',
            polygon: 'Monikulmio',
            erase: 'Tyhjennä'
        },
        share: 'Dela denna sida',
        shareTheme: 'Dela detta tema',
        metadata: 'Visa kartlagers metadata',
        showPageInfo: 'Visa sidinformation',
        showUserGuide: 'Visa bruksanvisningen',
    },
    gfi: {
        title: 'Objektuppgifter',
        close: 'Stänga'
    },
    warning: 'Obs!',
    multipleLayersWarning: 'You are about to activate 10 or more layers and it might affect the performance of the website',
    continue: 'continue',
    cancel: 'cancel',
    appGuide: {
        title: "Användarguide",
        modalContent: {
            upperBar: {
                title: "Top Bar-funktioner",
                content: {
                    0: {
                        title: "Återgå till startvyn",
                        text: "Startvyn är en fördefinierad vy som visar vattenvägar, järnvägsnätet och vägnätet i hela Finland."
                    },
                    1: {
                        title: "Dela sida",
                        text: "Du kan dela den aktuella vyn av kartan med en länk direkt till den valda tjänsten eller genom att kopiera länken. Vyn behåller fokus, zoomnivå och valda material och tema."
                    },
                    2: {
                        title: "Info",
                        text: "Bakom infoknappen hittar du information om applikationen, bruksanvisning och kontaktuppgifter för att skicka feedback till exempel."
                    },
                    3: {
                        title: "Språk",
                        text: "Du kan välja finska, svenska eller engelska som språk för karttjänsten."
                    }
                }
            },
            mapLevelMenu: {
                title: "Kartnivåmeny",
                subTitle: "Kartnivåmenyn öppnas uppe till vänster. Det finns 3 flikar att välja mellan",
                tabsContent: {
                    materList: "Du kan filtrera materiallistan efter ämne bakom filterknappen. Du kan söka på kartnivån efter namn genom att ange minst 3 bokstäver i sökfältet.",
                    themeLayerSelection: "Att välja ett tema visar kartnivåerna som definierats för temat och öppnar en meny för att välja kartmaterial som är relaterat till temat. En del av kartmaterialen har sin egen stil för temat. Det kan bara finnas ett tema åt gången. När ett tema är valt kan du också välja andra kartmaterial än de som definierats för temat i menyn Alla nivåer. Temat avslutas med temamarkören överst på kartan.",
                    selectedLayers: "Lista över valda kartnivåer på kartan. Du kan ändra ordningen på nivåerna genom att dra dem från ikonen till höger. Transparensen kan justeras med skjutreglaget och nivåvalet kan avmarkeras."
                },
            },
            search: {
                title: "Sök",
                content: "Sökningen öppnas i kartans övre högra hörn med hjälp av förstoringsglasknappen till vänster. Sökfunktionen låter dig söka efter dig och adresser genom att välja den sökning du vill använda från rullgardinsmenyn. Du kan ta bort ett sökresultat från kartan genom att trycka på papperskorgen i sökrutan."
            },
            measureTool: {
                title: "Ritverktyg",
                content: "Mätverktygen öppnas från ritikonen till vänster. Verktygen kan användas för att mäta längd eller area. mätresultaten kan raderas från kartan med den orangea gummiknappen."
            },
            setFullScreen: {
                title: "Bygga ut",
                content: "Expandera-knappen kan användas för att expandera Suomen Vaylat-applikationen så att den fyller hela skärmen."
            },
            zoomBar: {
                title: "Bildtexter / zoomfält",
                content: "Du kan öppna zoomnivån och kartnivåerna med deras bildtexter på kartan på den zoomnivån från bildtextikonen längst ner till höger. Kartnivåer listas först överst. Om du väljer en annan skala från zoomfältet flyttas till den valda inflygningsnivån."
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
            address: 'Adress sökning',
            vkm: 'Vägsökning'
        },
        vkm: {
            tie: 'Väg',
            osa: 'Vägsträcka',
            ajorata: 'Körbana',
            etaisyys: 'Avstånd (m)',
            error: {
                title: 'Vägsökning misslyckades',
                text: 'Sök efter följande fel:'
            }
        },
        address: {
            address: 'Opastinsilta 12 Helsinki',
            error: {
                title: 'Adress sökning',
                text: 'Inga resultat hittades för adressökning.'
            }
        }
    },
    dontShowAgain: 'Visa inte igen',
    ok: 'OK',
    layerlist: {
        layerlistLabels: {
            allLayers: 'Alla lager' ,
            themeLayers: 'Teman',
            selectedLayers: 'Valda lagert',
            mapLayers: 'Layers',
            backgroundMaps: 'Background maps',
            selectAll: 'Select all',
            show: 'Show',
            filterOrSearchLayers: 'Filter or search layers',
            filterByType: 'Filter by type',
            searchForLayers: 'Search for layers',
            clearFilters: 'Clear filters',
            searchResults: 'Search results',
            clearSelectedMapLayers: 'Clear selected map layers',
            clearSelectedBackgroundMaps: 'Clear selected background maps',
            noSearchResults: 'No search results',
            typeAtLeastThreeCharacters: 'Type at least 3 characters'
        },
        selectedLayers: {
            layerVisible: 'lager synligt',
            zoomInToShowLayer: 'Zooma in för att se kartlagret',
            zoomOutToShowLayer: 'Zooma ut för att se kartlagret',
            opacity: 'Genomskinlighet'
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
        title: '{0} -kartlager metadata',
        heading: {
            abstractTextData: 'Sammanfattning text (data)',
            abstractTextService: 'Sammanfattning text (tjänst)',
            accessConstraint: 'Åtkomstrestriktioner',
            citationDate: 'Datum',
            classification: 'Klassificeringar',
            descriptiveKeyword: 'Nyckelord',
            distributionFormat: 'Distributionsformat',
            fileIdentifier: 'Fil-identifikation',
            legalConstraint: 'Rättsliga restriktioner',
            lineageStatement: 'Härkomst uttalande',
            metadataCharacterSet: 'Teckenuppsättning i metadata',
            metadataDateStamp: 'Datum för metadata',
            metadataLanguage: 'Metadata språk',
            metadataOrganisation: 'Organisationsnamn',
            metadataStandardName: 'Metadata standard namn',
            metadataStandardVersion: 'Metadata standard version',
            onlineResource: 'Online resurser',
            operatesOn: 'Drivs med',
            otherConstraint: 'Övriga restriktioner',
            reportConformance: 'Specifikationsuppfyllelse',
            responsibleParty: 'Ansvarig part',
            resourceIdentifier: 'Resurs identifierare',
            resourceLanguage: 'Resurs språk',
            scopeCode: 'Resurs typ',
            serviceType: 'Service type',
            spatialRepresentationType: 'Rumslig presentationstyp',
            spatialResolution: 'Rumslig upplösning',
            temporalExtent: 'Temporära utsträckningar',
            topicCategory: 'Ämneskategorier',
            useLimitation: 'Använd begränsningar',
            absoluteExternalPositionalAccuracy: 'Absolut lägesnoggrannhet',
            accuracyOfTimeMeasurement: 'Tidsnoggrannhet',
            completenessCommission: 'Övertalighet',
            completenessOmission: 'Brist',
            conceptualConsistency: 'Konceptuell konsistens',
            domainConsistency: 'Domänkonsistens',
            formatConsistency: 'Formatkonsistens',
            griddedDataPositionalAccuracy: 'Lägesnoggrannhet hos rasterdata',
            nonQuantitativeAttributeAccuracy: 'Tematisk noggrannhet kvalitativa attribut',
            quantitativeAttributeAccuracy: 'Tematisk noggrannhet kvantitativa attribut',
            relativeInternalPositionalAccuracy: 'Relativ lägesnoggrannhet',
            temporalConsistency: 'Temporal konsistens',
            temporalValidity: 'Temporal validitet',
            thematicClassificationCorrectness: 'Klassificeringsnoggrannhet',
            topologicalConsistency: 'Topologisk konsistens'
        },
        qualityContent: {
            qualityPassTrue: 'Datamängden uppfyller specifikationen.',
            qualityPassFalse: 'Datamängden uppfyller inte specifikationen.',
            nameOfMeasure: 'Namn på Measure',
            citationTitle: 'Titel',
            measureIdentificationCode: 'Mät identifieringskod',
            measureIdentificationAuthorization: 'Mät identifierings authorization',
            measureDescription: 'Mät beskrivning',
            evaluationMethodType: 'Utvärderingsmetod',
            evaluationMethodDescription: 'Utvärderingsmetodbeskrivning',
            evaluationProcedure: 'Utvärderingsförfarande',
            dateTime: 'Datum / tid',
            specification: 'Specifikationstitel',
            explanation: 'Förklaring',
            valueType: 'Värde typ',
            valueUnit: 'Värdenhet',
            errorStatistic: 'Felstatistik',
            value: 'Värde',
            conformanceResult: 'Överensstämmelse Resultat',
            quantitativeResult: 'Kvantitativt resultat'
        },
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
                    'description': 'Japansk kod uppsättning som används för elektronisk överföring'
                },
                'shiftJIS': {
                    'label': 'Shift JIS',
                    'description': 'Japansk kod uppsättning som används på MS-DOS-maskiner'
                },
                'eucJP': {
                    'label': 'EUC JP',
                    'description': 'Japansk kod uppsättning som används på UNIX-baserade maskiner'
                },
                'usAscii': {
                    'label': 'US ASCII',
                    'description': 'USA ASCII-kod set (ISO 646 US)'
                },
                'ebcdic': {
                    'label': 'EBCDIC',
                    'description': 'IBM stordator koduppsättning'
                },
                'eucKR': {
                    'label': 'EUC KR',
                    'description': 'Koreansk koduppsättning'
                },
                'big5': {
                    'label': 'Big 5',
                    'description': 'Traditionell kinesisk kod uppsättning som används i Taiwan, Hongkong Kina och andra områden'
                },
                'GB2312': {
                    'label': 'GB2312',
                    'description': 'Förenklad kinesisk koduppsättning'
                }
            },
            'gmd:MD_ClassificationCode': {
                'unclassified': {
                    'label': 'Oklassificerad',
                    'description': 'Tillgänglig för allmän spridning'
                },
                'restricted': {
                    'label': 'Begränsad',
                    'description': 'Inte för allmän spridning'
                },
                'confidential': {
                    'label': 'Konfidentiell',
                    'description': 'Tillgänglig för någon som kan anförtros information'
                },
                'secret': {
                    'label': 'Hemlig',
                    'description': 'Hålls eller tänkt att hållas privat, okänt eller dold från alla utom en utvald grupp människor'
                },
                'topSecret': {
                    'label': 'Mycket högt skyddsbehov',
                    'description': 'Av högsta sekretess'
                }
            },
            'gmd:CI_DateTypeCode': {
                'creation': {
                    'label': 'Skapande',
                    'description': 'Datum som anger när resursen ursprungligen skapades.'
                },
                'publication': {
                    'label': 'Publicering',
                    'description': 'Datum som anger när resursen blev utgiven.'
                },
                'revision': {
                    'label': 'Revision',
                    'description': 'Datum som anger när resursen blev granskad eller omgranskad och förbättrad eller rättad.'
                }
            },
            'gmd:MD_RestrictionCode': {
                'copyright': {
                    'label': 'Upphovsrätt',
                    'description': 'Ensamrätt att framställa exemplar av ett verk och i vilken omfattning verket får göras tillgänglig för allmänheten ANM. Regleras i Sverige enligt lagen 1960:779 om upphovsrätt till litterära och konstnärliga verk.'
                },
                'patent': {
                    'label': 'Patent',
                    'description': 'Ensamrätt att efter ansökan yrkesmässigt utnyttja uppfinningen (under 20 år) ANM. Regleras i Sverige enligt patentlagen (1967:837).'
                },
                'patentPending': {
                    'label': 'Avvaktar patent',
                    'description': 'Information som är under ansökan av patent'
                },
                'trademark': {
                    'label': 'Varumärke',
                    'description': 'Allt som kan individualisera något t ex ord, figurer, förpackningsformer, slogan eller ljud i syfte att särskilja ett företag och dess produkter från andra företag eller produkter ANM. Genom registrering eller inarbetning kan ensamrätt erhållas enligt varumärkeslagen (1960:644).'
                },
                'license': {
                    'label': 'Licens',
                    'description': 'Formaliserat tillstånd att använda en resurs'
                },
                'intellectualPropertyRights': {
                    'label': 'Immateriella rättigheter',
                    'description': 'Rättighet till finansiell nytta av och kontroll av distribution av immateriell egendom som är resultat av en skapande process ANM. Skyddet om fattar patent, varumärke, mönster, upphovsrätt, m.fl.'
                },
                'restricted': {
                    'label': 'Begränsad',
                    'description': 'Begränsade spridningsrättigheter'
                },
                'otherRestrictions': {
                    'label': 'Andra begränsningar',
                    'description': 'Ospecificerade begränsningar'
                }
            },
            'gmd:MD_ScopeCode': {
                'attribute': {
                    'label': 'Attribut',
                    'description': 'Information avser attributsklassen'
                },
                'attributeType': {
                    'label': 'Attributtyp',
                    'description': 'Information gäller för kännetecken för en funktion'
                },
                'collectionHardware': {
                    'label': 'Insamling hårdvara',
                    'description': 'information om använd insamlingsutrustning'
                },
                'collectionSession': {
                    'label': 'Informationsinsamling',
                    'description': 'information om informationsinsamlingen'
                },
                'dataset': {
                    'label': 'Dataset',
                    'description': 'information gäller för dataset'
                },
                'series': {
                    'label': 'Serier',
                    'description': 'Information gäller för serien'
                },
                'nonGeographicDataset': {
                    'label': 'Icke geografiskt dataset',
                    'description': 'Information gäller för icke-geografiska data'
                },
                'dimensionGroup': {
                    'label': 'Grupp av dimensioner',
                    'description': 'information gäller för en grupperad nivå av dimensioner'
                },
                'feature': {
                    'label': 'Funktion',
                    'description': 'Informationen avser en funktion'
                },
                'featureType': {
                    'label': 'Funktionstyp',
                    'description': 'Informationen avser en typfunktion'
                },
                'propertyType': {
                    'label': 'Fastighetstyp',
                    'description': 'information gäller för en fastighetstyp'
                },
                'fieldSession': {
                    'label': 'Fält session',
                    'description': 'Information gäller för en fält session'
                },
                'software': {
                    'label': 'Programvara',
                    'description': 'Information gäller för ett dataprogram eller rutin'
                },
                'service': {
                    'label': 'Tjänst',
                    'description': 'Informationen avser en förmåga som en tjänsteleverantör skall lämna till en tjänsteanvändare genom en uppsättning gränssnitt som definierar ett beteende, såsom ett användningsfall'
                },
                'model': {
                    'label': 'Modell',
                    'description': 'Informationen gäller för en kopia eller imitation av en befintlig eller ett hypotetisk objekt'
                },
                'tile': {
                    'label': 'Partition',
                    'description': 'Informationen avser en ruta, en rumslig delmängd av geografiska uppgifter'
                }
            },
            'gmd:MD_SpatialRepresentationTypeCode': {
                'vector': {
                    'label': 'Vektor',
                    'description': 'Vektordata används för att representera geografiska uppgifter'
                },
                'grid': {
                    'label': 'Rutnät',
                    'description': 'Rutnätsdata används för att representera geografiska uppgifter'
                },
                'textTable': {
                    'label': 'Text, tabell',
                    'description': 'Text- eller tabelldata används för att representera geografiska uppgifter'
                },
                'tin': {
                    'label': 'TIN',
                    'description': 'Triangulärt oregelbundet nätverk'
                },
                'stereoModel': {
                    'label': 'Stereomodell',
                    'description': 'Tredimensionell vy som skapas genom ett par överlappande bilder, t.ex. flyg- eller satellitbi'
                },
                'video': {
                    'label': 'Video',
                    'description': 'Scen från en videoinspelning'
                }
            },
            'gmd:MD_TopicCategoryCode': {
                'farming': {
                    'label': 'Jordbruk',
                    'description': 'Uppfödning av djur och / eller odling av växter. Exempel: jordbruk, bevattning, vattenbruk, planteringar, vallning, skadedjur och sjukdomar som drabbar grödor och boskap'
                },
                'biota': {
                    'label': 'Flora och fauna',
                    'description': 'Flora och fauna i naturlig miljö Ex. vilda djur, vegetation, biologiska vetenskaper, ekologi, vildmark, havsdjur, våtmark och habitat'
                },
                'boundaries': {
                    'label': 'Gränser',
                    'description': 'Rättsliga landbeskrivningar. Exempel: politiska och administrativa gränser'
                },
                'climatologyMeteorologyAtmosphere': {
                    'label': 'Klimatologi, meteorologi, atmosfär',
                    'description': 'Processer och fenomen i atmosfären. Exempel: molntäcke, väder, klimat, atmosfäriska förhållanden, klimatförändringar, nederbörd'
                },
                'economy': {
                    'label': 'Ekonomi',
                    'description': 'Ekonomiska aktiviteter, förhållanden och sysselsättning Ex. produktion, arbete, omsättning, handel, industri, turism och ekoturism, skogsbruk, fiske, prospektering och utvinning av naturresurser'
                },
                'elevation': {
                    'label': 'Höjd',
                    'description': 'Höjd över eller under havsytan Ex. terränginformation som höjdvärden, batymetri, digtala terrängmodeller, lutning och härledda produkter'
                },
                'environment': {
                    'label': 'Miljö',
                    'description': 'Miljöresurser, miljöskydd och bevarande Ex. miljöförorening, avfallshantering, miljökonsekvensbeskrivningar, miljörisker, naturreservat, landskap'
                },
                'geoscientificInformation': {
                    'label': 'Geovetenskaplig information',
                    'description': 'Information avseende geovetenskap. Ex. geofysiska företeelser och processer, geologi, mineral, berggrund, jordbävningar, skred, jordarter, grundvatten, erosion, vattenkvalitet, hydrologi'
                },
                'health': {
                    'label': 'Hälsa',
                    'description': 'hälsa, sjuk- och hälsovård, human ekologi och säkerhet Ex. sjukdom, hälsofaktorer, hygien, missbruk, mental och fysisk hälsa, hälsovård'
                },
                'imageryBaseMapsEarthCover': {
                    'label': 'Arealtäckande bilder och bakgrundskartor',
                    'description': 'Arealtäckande bilder och bakgrundskartor Ex. marktäcke, ortofoton, oklassificerade bilder, topografiska kartor, karttext'
                },
                'intelligenceMilitary': {
                    'label': 'Militär underrättelsetjänst',
                    'description': 'Militärbaser, strukturer, aktiviteter. Exempel: baracker, träningsfält, militära transporter, underrättelseverksamhet'
                },
                'inlandWaters': {
                    'label': 'Sjöar och vattendrag',
                    'description': 'insjövatten, dräneringssystem och deras egenskaper Ex. vattendrag och glaciärer, dammar, översvämmning, avrinningsområden, vattenkvalitet'
                },
                'location': {
                    'label': 'Läge',
                    'description': 'Positionsinformation och tjänster. Exempel: adresser, geodetiska nät, kontrollpunkter, postnummer områden, ortnamn'
                },
                'oceans': {
                    'label': 'Oceaner',
                    'description': 'Funktioner och egenskaper hos saltvattenförekomster (exklusive inlandsvatten). Exempel: tidvatten, tidvattenvågor, kust information, rev'
                },
                'planningCadastre': {
                    'label': 'Fastigheter och fysisk planering',
                    'description': 'Information som används för lämpliga åtgärder för framtida användning av marken. Exempel: markanvändning, detaljplaner,  fastighetsundersökningar,  markägande, områdesbestämmelser,fastighetskartor'
                },
                'society': {
                    'label': 'Samhälle',
                    'description': 'Kännetecken för samhället och kulturer. Exempel: bosättningar, antropologi, arkeologi, utbildning, traditionella övertygelser, seder och bruk, demografiska data, rekreationsområden och aktiviteter, sociala konsekvensanalyser, brottslighet och rättvisa, folkräkning'
                },
                'structure': {
                    'label': 'Struktur',
                    'description': 'Konstruktioner skapade av människohand. Exempel: byggnader, museer, kyrkor, fabriker, bostäder, monument, affärer, torn'
                },
                'transportation': {
                    'label': 'Transport',
                    'description': 'Medel och hjälpmedel för att transportera personer och / eller gods. Exempel: vägar, flygplatser / landningsbanor, sjövägar, tunnlar, sjökort, fordon eller fartyg plats, flygkartor, järnvägar'
                },
                'utilitiesCommunication': {
                    'label': 'Tekniska försörjningssystem',
                    'description': 'Energi, vatten och avfallssystem och kommunikationsinfrastruktur och tjänster. Exempel: vattenkraft, geotermisk energi, sol- och nukleära energikällor, vattenrening och distribution, avloppsinsamling och omhändertagande, el och gasdistribution, datakommunikation, telekommunikation, radio, kommunikationsnät'
                }
            }
        },
        // copied from https://github.com/oskariorg/oskari-frontend/blob/master/bundles/framework/divmanazer/resources/locale/sv.js
        languages: {
            af: 'afrikaans',
            ak: 'akan',
            am: 'amhariska',
            ar: 'arabiska',
            az: 'azerbajdzjanska',
            be: 'vitryska',
            bg: 'bulgariska',
            bm: 'bambara',
            bn: 'bengali',
            bo: 'tibetanska',
            br: 'bretonska',
            bs: 'bosniska',
            ca: 'katalanska',
            cs: 'tjeckiska',
            cy: 'walesiska',
            da: 'danska',
            de: 'tyska',
            dz: 'bhutanesiska',
            ee: 'ewe',
            el: 'grekiska',
            en: 'engelska',
            eo: 'esperanto',
            es: 'spanska',
            et: 'estniska',
            eu: 'baskiska',
            fa: 'persiska',
            ff: 'fulani',
            fi: 'finska',
            fo: 'färöiska',
            fr: 'franska',
            fy: 'västfrisiska',
            ga: 'iriska',
            gd: 'höglandsskotska',
            gl: 'galiciska',
            gu: 'gujarati',
            ha: 'hausa',
            he: 'hebreiska',
            hi: 'hindi',
            hr: 'kroatiska',
            hu: 'ungerska',
            hy: 'armeniska',
            ia: 'interlingua',
            id: 'indonesiska',
            ig: 'igbo',
            is: 'isländska',
            it: 'italienska',
            ja: 'japanska',
            ka: 'georgiska',
            ki: 'kikuyu',
            kk: 'kazakiska',
            kl: 'grönländska',
            km: 'kambodjanska',
            kn: 'kannada',
            ko: 'koreanska',
            ks: 'kashmiriska',
            kw: 'korniska',
            ky: 'kirgisiska',
            lb: 'luxemburgiska',
            lg: 'luganda',
            ln: 'lingala',
            lo: 'laotiska',
            lt: 'litauiska',
            lu: 'luba-katanga',
            lv: 'lettiska',
            mg: 'malagassiska',
            mk: 'makedonska',
            ml: 'malayalam',
            mn: 'mongoliska',
            mr: 'marathi',
            ms: 'malajiska',
            mt: 'maltesiska',
            my: 'burmesiska',
            nb: 'norskt bokmål',
            nd: 'nordndebele',
            ne: 'nepalesiska',
            nl: 'nederländska',
            nn: 'nynorska',
            om: 'oromo',
            or: 'oriya',
            os: 'ossetiska',
            pa: 'punjabi',
            pl: 'polska',
            ps: 'afghanska',
            pt: 'portugisiska',
            qu: 'quechua',
            rm: 'rätoromanska',
            rn: 'rundi',
            ro: 'rumänska',
            ru: 'ryska',
            rw: 'kinjarwanda',
            se: 'nordsamiska',
            sg: 'sango',
            si: 'singalesiska',
            sk: 'slovakiska',
            sl: 'slovenska',
            sn: 'shona',
            so: 'somaliska',
            sq: 'albanska',
            sr: 'serbiska',
            sv: 'svenska',
            sw: 'swahili',
            ta: 'tamil',
            te: 'telugiska',
            th: 'thailändska',
            ti: 'tigrinja',
            tn: 'tswana',
            to: 'tonganska',
            tr: 'turkiska',
            ts: 'tsonga',
            ug: 'uiguriska',
            uk: 'ukrainska',
            ur: 'urdu',
            uz: 'uzbekiska',
            vi: 'vietnamesiska',
            yi: 'jiddisch',
            yo: 'yoruba',
            zh: 'kinesiska',
            zu: 'zulu'
        }
    },
    legend: {
        title: 'Förklaringar',
        nolegend: 'Inte en legend',
        noSelectedLayers: 'Inga kartlager har valts'
    },
    share: {
        title: 'Dela denna sida',
        shareTexts: {
            title: 'Suomen Väylät - kartlänk',
            emailBody: 'Kartlänk: ',
            copiedToClipboard: 'Kopierat till urklipp'
        },
        tooltips: {
            clipboard: 'Kopiera till Urklipp',
            email: 'Skicka via e-post',
            facebook: 'Dela på Facebook',
            twitter: 'Dela på Twitter',
            linkedin: 'Dela på LinkedIn',
            whatsapp: 'Dela på WhatsApp',
            telegram: 'Dela på Telegram'
        }
    }
}

export default sv;