const en = {
    language: {
        languageSelection: {
            fi: 'FI',
            en: 'EN',
            sv: 'SV'
        }
    },
    title: 'Suomen Väylät EN',
    tooltips: {
        layerlistButton: 'Layerlist',
        searchButton: 'Search',
        legendButton: 'Legend',
        fullscreenButton: 'Full screen',
        legendHeader: 'Visible at this zoom level',
        myLocButton: 'My location',
        zoomExpand: 'Expand',
        zoomIn: 'Zoom in',
        zoomOut: 'Zoom out',
        opacity: 'Opacity',
        drawingtools: {
            drawingtoolsButton: 'Drawing tools',
            circle: 'Circle',
            square: 'Square',
            box: 'Box',
            linestring: 'Line',
            polygon: 'Polygon',
            erase: 'Erase'
        },
        share: 'Share this page',
        shareTheme: 'Share this theme',
        metadata: 'Show maplayer metadata',
        showPageInfo: 'Show page info'
    },
    gfi: {
        title: 'Feature Data',
        close: 'Close'
    },
    warning: 'Warning!',
    multipleLayersWarning: 'You are about to activate 10 or more maplayers and it might affect the performance of the service',
    continue: 'continue',
    cancel: 'cancel',
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
            address: 'Address search',
            vkm: 'Road search'
        },
        vkm: {
            tie: 'Road',
            osa: 'Road section',
            ajorata: 'Carriageway',
            etaisyys: 'Distance (m)',
            error: {
                title: 'Road search failed',
                text: 'Check for the following errors:'
            }
        },
        address: {
            address: 'Opastinsilta 12 Helsinki',
            error: {
                title: 'Address search',
                text: 'No results were found for the address search.'
            }
        }
    },
    dontShowAgain: 'Don\'t show again',
    ok: 'OK',
    layerlist: {
        layerlistLabels: {
            allLayers: 'All layers' ,
            themeLayers: 'Themes',
            selectedLayers: 'Selected layers',
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
            layerVisible: 'Layer visible',
            zoomInToShowLayer: 'Zoom in to see the map layer',
            zoomOutToShowLayer: 'Zoom out to see the map layer',
            opacity: 'Transparency'
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
    },data: {
        title: '{0} -map layer metadata',
        heading: {
            abstractTextData: 'Abstract text (data)',
            abstractTextService: 'Abstract text (service)',
            accessConstraint: 'Access constraints',
            citationDate: 'Date',
            classification: 'Classifications',
            descriptiveKeyword: 'Keywords',
            distributionFormat: 'Distribution format',
            fileIdentifier: 'File identifier',
            legalConstraint: 'Legal constraints',
            lineageStatement: 'Lineage statement',
            metadataCharacterSet: 'Metadata characterset',
            metadataDateStamp: 'Metadata date',
            metadataLanguage: 'Metadata language',
            metadataOrganisation: 'Organisation name',
            metadataStandardName: 'Metadata standard name',
            metadataStandardVersion: 'Metadata standard version',
            onlineResource: 'Online resources',
            operatesOn: 'Operates on',
            otherConstraint: 'Other constraints',
            reportConformance: 'Conformance',
            responsibleParty: 'Responsible party',
            resourceIdentifier: 'Resource identifier',
            resourceLanguage: 'Resource language',
            scopeCode: 'Resource type',
            serviceType: 'Service type',
            spatialRepresentationType: 'Spatial representation type',
            spatialResolution: 'Spatial resolution',
            temporalExtent: 'Temporal extents',
            topicCategory: 'Topic categories',
            useLimitation: 'Use limitations',
            absoluteExternalPositionalAccuracy: 'Absolute external positional accuracy',
            accuracyOfTimeMeasurement: 'Accuracy of time measurement',
            completenessCommission: 'Completeness commission',
            completenessOmission: 'Completeness omission',
            conceptualConsistency: 'Conceptual consistency',
            domainConsistency: 'Domain consistency',
            formatConsistency: 'Format consistency',
            griddedDataPositionalAccuracy: 'Gridded data positional accuracy',
            nonQuantitativeAttributeAccuracy: 'Non quantitative attribute accuracy',
            quantitativeAttributeAccuracy: 'Quantitative attribute accuracy',
            relativeInternalPositionalAccuracy: 'Relative internal positional accuracy',
            temporalConsistency: 'Temporal consistency',
            temporalValidity: 'Temporal validity',
            thematicClassificationCorrectness: 'Thematic classification correctness',
            topologicalConsistency: 'Topological consistency'
        },
        qualityContent: {
            qualityPassTrue: 'Dataset is conformant to the specification.',
            qualityPassFalse: 'Dataset is not conformant to the specification.',
            nameOfMeasure: 'Name of Measure',
            citationTitle: 'Title',
            measureIdentificationCode: 'Measure identification code',
            measureIdentificationAuthorization: 'Measure identification authorization',
            measureDescription: 'Measure description',
            evaluationMethodType: 'Evaluation Method',
            evaluationMethodDescription: 'Evaluation method description',
            evaluationProcedure: 'Evaluation procedure',
            dateTime: 'Date / Time',
            specification: 'Specification title',
            explanation: 'Explanation',
            valueType: 'Value type',
            valueUnit: 'Value unit',
            errorStatistic: 'Error statistic',
            value: 'Value',
            conformanceResult: 'Conformance Result',
            quantitativeResult: 'Quantitative Result'
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
                    'label': 'Unclassified',
                    'description': 'Available for general disclosure'
                },
                'restricted': {
                    'label': 'Restricted',
                    'description': 'Not for general disclosure'
                },
                'confidential': {
                    'label': 'Confidential',
                    'description': 'Available for someone who can be entrusted with information'
                },
                'secret': {
                    'label': 'Secret',
                    'description': 'Kept or meant to be kept private, unknown, or hidden from all but a select group of people'
                },
                'topSecret': {
                    'label': 'Top secret',
                    'description': 'Of the highest secrecy'
                }
            },
            'gmd:CI_DateTypeCode': {
                'creation': {
                    'label': 'Creation',
                    'description': 'Date identifies when the resource was brought into existence.'
                },
                'publication': {
                    'label': 'Publication',
                    'description': 'Date identifies when the resource was issued.'
                },
                'revision': {
                    'label': 'Revision',
                    'description': 'Date identifies when the resource was examined or re-examined and improved or amended.'
                }
            },
            'gmd:MD_RestrictionCode': {
                'copyright': {
                    'label': 'Copyright',
                    'description': 'Exclusive right to the publication, production, or sale of the rights to a literary, dramatic, musical, or artistic work, or to the use of a commercial print or label, granted by law for a specified period of time to an author, composer, artist, distributor'
                },
                'patent': {
                    'label': 'Patent',
                    'description': 'Government has granted exclusive right to make, sell, use or license an invention or discovery'
                },
                'patentPending': {
                    'label': 'Pending patent',
                    'description': 'Produced or sold information awaiting a patent'
                },
                'trademark': {
                    'label': 'Trademark',
                    'description': 'A name, symbol, or other device identifying a product, officially registered and legally restricted to the use of the owner or manufacturer'
                },
                'license': {
                    'label': 'License',
                    'description': 'Formal permission to do something'
                },
                'intellectualPropertyRights': {
                    'label': 'Intellectual property rights',
                    'description': 'Rights to financial benefit from and control of distribution of non-tangible property that is a result of creativity'
                },
                'restricted': {
                    'label': 'Restricted',
                    'description': 'Withheld from general circulation or disclosure'
                },
                'otherRestrictions': {
                    'label': 'Other restrictions',
                    'description': 'Limitation not listed'
                }
            },
            'gmd:MD_ScopeCode': {
                'attribute': {
                    'label': 'Attribute',
                    'description': 'Information applies to the attribute class'
                },
                'attributeType': {
                    'label': 'Attribute type',
                    'description': 'Information applies to the characteristic of a feature'
                },
                'collectionHardware': {
                    'label': 'Collection hardware',
                    'description': 'Information applies to the collection hardware class'
                },
                'collectionSession': {
                    'label': 'Collection session',
                    'description': 'Information applies to the collection session'
                },
                'dataset': {
                    'label': 'Dataset',
                    'description': 'Information applies to the dataset'
                },
                'series': {
                    'label': 'Series',
                    'description': 'Information applies to the series'
                },
                'nonGeographicDataset': {
                    'label': 'Non geographic dataset',
                    'description': 'Information applies to non-geographic data'
                },
                'dimensionGroup': {
                    'label': 'Dimension group',
                    'description': 'Information applies to a dimension group'
                },
                'feature': {
                    'label': 'Feature',
                    'description': 'Information applies to a feature'
                },
                'featureType': {
                    'label': 'Feature type',
                    'description': 'Information applies to a feature type'
                },
                'propertyType': {
                    'label': 'Property type',
                    'description': 'Information applies to a property type'
                },
                'fieldSession': {
                    'label': 'Field session',
                    'description': 'Information applies to a field session'
                },
                'software': {
                    'label': 'Software',
                    'description': 'Information applies to a computer program or routine'
                },
                'service': {
                    'label': 'Service',
                    'description': 'Information applies to a capability which a service provider entity makes available to a service user entity through a set of interfaces that define a behaviour, such as a use case'
                },
                'model': {
                    'label': 'Model',
                    'description': 'Information applies to a copy or imitation of an existing or hypothetical object'
                },
                'tile': {
                    'label': 'Tile',
                    'description': 'Information applies to a tile, a spatial subset of geographic data'
                }
            },
            'gmd:MD_SpatialRepresentationTypeCode': {
                'vector': {
                    'label': 'Vector',
                    'description': 'Vector data is used to represent geographic data'
                },
                'grid': {
                    'label': 'Grid',
                    'description': 'Grid data is used to represent geographic data'
                },
                'textTable': {
                    'label': 'Text, table',
                    'description': 'Textual or tabular data is used to represent geographic data'
                },
                'tin': {
                    'label': 'TIN',
                    'description': 'Triangulated irregular network'
                },
                'stereoModel': {
                    'label': 'Stereo model',
                    'description': 'Three-dimensional view formed by the intersecting homologous rays of an overlapping pair of images'
                },
                'video': {
                    'label': 'Video',
                    'description': 'Scene from a video recording'
                }
            },
            'gmd:MD_TopicCategoryCode': {
                'farming': {
                    'label': 'Farming',
                    'description': 'Rearing of animals and/or cultivation of plants. Examples: agriculture, irrigation, aquaculture, plantations, herding, pests and diseases affecting crops and livestock'
                },
                'biota': {
                    'label': 'Biota',
                    'description': 'Flora and/or fauna in natural environment. Examples: wildlife, vegetation, biological sciences, ecology, wilderness, sealife, wetlands, habitat'
                },
                'boundaries': {
                    'label': 'Boundaries',
                    'description': 'Legal land descriptions. Examples: political and administrative boundaries'
                },
                'climatologyMeteorologyAtmosphere': {
                    'label': 'Climatology, meteorology, atmosphere',
                    'description': 'Processes and phenomena of the atmosphere. Examples: cloud cover, weather, climate, atmospheric conditions, climate change, precipitation'
                },
                'economy': {
                    'label': 'Economy',
                    'description': 'Economic activities, conditions and employment. Examples: production, labour, revenue, commerce, industry, tourism and ecotourism, forestry, fisheries, commercial or subsistence hunting, exploration and exploitation of resources such as minerals, oil and gas'
                },
                'elevation': {
                    'label': 'Elevation',
                    'description': 'Height above or below sea level. Examples: altitude, bathymetry, digital elevation models, slope, derived products'
                },
                'environment': {
                    'label': 'Environment',
                    'description': 'Environmental resources, protection and conservation. Examples: environmental pollution, waste storage and treatment, environmental impact assessment, monitoring environmental risk, nature reserves, landscape'
                },
                'geoscientificInformation': {
                    'label': 'Geoscientific information',
                    'description': 'Information pertaining to earth sciences. Examples: geophysical features and processes, geology, minerals, sciences dealing with the composition, structure and origin of the earth s rocks, risks of earthquakes, volcanic activity, landslides, gravity information, soils, permafrost, hydrogeology, erosion'
                },
                'health': {
                    'label': 'Health',
                    'description': 'Health, health services, human ecology, and safety. Examples: disease and illness, factors affecting health, hygiene, substance abuse, mental and physical health, health services'
                },
                'imageryBaseMapsEarthCover': {
                    'label': 'Imagery base maps earth cover',
                    'description': 'Base maps. Examples: land cover, topographic maps, imagery, unclassified images, annotations'
                },
                'intelligenceMilitary': {
                    'label': 'Intelligence military',
                    'description': 'Military bases, structures, activities. Examples: barracks, training grounds, military transportation, information collection'
                },
                'inlandWaters': {
                    'label': 'Inland waters',
                    'description': 'Inland water features, drainage systems and their characteristics. Examples: rivers and glaciers, salt lakes, water utilization plans, dams, currents, floods, water quality, hydrographic charts'
                },
                'location': {
                    'label': 'Location',
                    'description': 'Positional information and services. Examples: addresses, geodetic networks, control points, postal zones and services, place names'
                },
                'oceans': {
                    'label': 'Oceans',
                    'description': 'Features and characteristics of salt water bodies (excluding inland waters). Examples: tides, tidal waves, coastal information, reefs'
                },
                'planningCadastre': {
                    'label': 'Planning cadastre',
                    'description': 'Information used for appropriate actions for future use of the land. Examples: land use maps, zoning maps, cadastral surveys, land ownership'
                },
                'society': {
                    'label': 'Society',
                    'description': 'Characteristics of society and cultures. Examples: settlements, anthropology, archaeology, education, traditional beliefs, manners and customs, demographic data, recreational areas and activities, social impact assessments, crime and justice, census information'
                },
                'structure': {
                    'label': 'Structure',
                    'description': 'Man-made construction. Examples: buildings, museums, churches, factories, housing, monuments, shops, towers'
                },
                'transportation': {
                    'label': 'Transportation',
                    'description': 'Means and aids for conveying persons and/or goods. Examples: roads, airports/airstrips, shipping routes, tunnels, nautical charts, vehicle or vessel location, aeronautical charts, railways'
                },
                'utilitiesCommunication': {
                    'label': 'Utilities communication',
                    'description': 'Energy, water and waste systems and communications infrastructure and services. Examples: hydroelectricity, geothermal, solar and nuclear sources of energy, water purification and distribution, sewage collection and disposal, electricity and gas distribution, data communication, telecommunication, radio, communication networks'
                }
            }
        },
        // Copied from: https://github.com/oskariorg/oskari-frontend/blob/master/bundles/framework/divmanazer/resources/locale/en.js
        languages: {
            af: 'Afrikaans',
            ak: 'Akan',
            am: 'Amharic',
            ar: 'Arabic',
            az: 'Azerbaijani',
            be: 'Belarusian',
            bg: 'Bulgarian',
            bm: 'Bambara',
            bn: 'Bengali',
            bo: 'Tibetan',
            br: 'Breton',
            bs: 'Bosnian',
            ca: 'Catalan',
            cs: 'Czech',
            cy: 'Welsh',
            da: 'Danish',
            de: 'German',
            dz: 'Dzongkha',
            ee: 'Ewe',
            el: 'Greek',
            en: 'English',
            eo: 'Esperanto',
            es: 'Spanish',
            et: 'Estonian',
            eu: 'Basque',
            fa: 'Persian',
            ff: 'Fulah',
            fi: 'Finnish',
            fo: 'Faroese',
            fr: 'French',
            fy: 'Western Frisian',
            ga: 'Irish',
            gd: 'Scottish Gaelic',
            gl: 'Galician',
            gu: 'Gujarati',
            ha: 'Hausa',
            he: 'Hebrew',
            hi: 'Hindi',
            hr: 'Croatian',
            hu: 'Hungarian',
            hy: 'Armenian',
            ia: 'Interlingua',
            id: 'Indonesian',
            ig: 'Igbo',
            is: 'Icelandic',
            it: 'Italian',
            ja: 'Japanese',
            ka: 'Georgian',
            ki: 'Kikuyu',
            kk: 'Kazakh',
            kl: 'Kalaallisut',
            km: 'Khmer',
            kn: 'Kannada',
            ko: 'Korean',
            ks: 'Kashmiri',
            kw: 'Cornish',
            ky: 'Kyrgyz',
            lb: 'Luxembourgish',
            lg: 'Ganda',
            ln: 'Lingala',
            lo: 'Lao',
            lt: 'Lithuanian',
            lu: 'Luba-Katanga',
            lv: 'Latvian',
            mg: 'Malagasy',
            mk: 'Macedonian',
            ml: 'Malayalam',
            mn: 'Mongolian',
            mr: 'Marathi',
            ms: 'Malay',
            mt: 'Maltese',
            my: 'Burmese',
            nb: 'Norwegian Bokmål',
            nd: 'North Ndebele',
            ne: 'Nepali',
            nl: 'Dutch',
            nn: 'Norwegian Nynorsk',
            om: 'Oromo',
            or: 'Oriya',
            os: 'Ossetic',
            pa: 'Punjabi',
            pl: 'Polish',
            ps: 'Pashto',
            pt: 'Portuguese',
            qu: 'Quechua',
            rm: 'Romansh',
            rn: 'Rundi',
            ro: 'Romanian',
            ru: 'Russian',
            rw: 'Kinyarwanda',
            se: 'Northern Sami',
            sg: 'Sango',
            si: 'Sinhala',
            sk: 'Slovak',
            sl: 'Slovenian',
            sn: 'Shona',
            so: 'Somali',
            sq: 'Albanian',
            sr: 'Serbian',
            sv: 'Swedish',
            sw: 'Swahili',
            ta: 'Tamil',
            te: 'Telugu',
            th: 'Thai',
            ti: 'Tigrinya',
            tn: 'Tswana',
            to: 'Tongan',
            tr: 'Turkish',
            ts: 'Tsonga',
            ug: 'Uyghur',
            uk: 'Ukrainian',
            ur: 'Urdu',
            uz: 'Uzbek',
            vi: 'Vietnamese',
            yi: 'Yiddish',
            yo: 'Yoruba',
            zh: 'Chinese',
            zu: 'Zulu'
        }
    },
    legend: {
        title: 'Map legends',
        nolegend: 'No layer legend',
        noSelectedLayers: 'No map layers selected'
    },
    share: {
        title: 'Share this page',
        shareTexts: {
            title: 'Suomen Väylät - map link',
            emailBody: 'Map link: ',
            copiedToClipboard: 'Copied to clipboard'
        },
        tooltips: {
            clipboard: 'Copy to clipboard',
            email: 'Send by email',
            facebook: 'Share on Facebook',
            twitter: 'Share on Twitter',
            linkedin: 'Share on LinkedIn',
            whatsapp: 'Share on WhatsApp',
            telegram: 'Share on Telegram'
        }
    }
}

export default en;