const EMPLOYEE_DATA = [
  {
    "ID": "128",
    "Name": "Saleh Faraj Salem Al-Jaberi",
    "Company": "PetroMasila-BLK53",
    "Department": "Managment",
    "Rotations": [
      {
        "id": "rot_1",
        "type": "work",
        "start": "2025-11-26",
        "end": "2025-12-23"
      },
      {
        "id": "rot_2",
        "type": "leave",
        "start": "2025-12-24",
        "end": "2026-01-20"
      },
      {
        "id": "rot_3",
        "type": "work",
        "start": "2026-01-21",
        "end": "2026-02-17"
      },
      {
        "id": "rot_4",
        "type": "leave",
        "start": "2026-02-18",
        "end": "2026-03-17"
      },
      {
        "id": "rot_5",
        "type": "work",
        "start": "2026-03-18",
        "end": "2026-04-14"
      },
      {
        "id": "rot_6",
        "type": "leave",
        "start": "2026-04-15",
        "end": "2026-05-12"
      },
      {
        "id": "rot_7",
        "type": "work",
        "start": "2026-05-13",
        "end": "2026-06-09"
      },
      {
        "id": "rot_8",
        "type": "leave",
        "start": "2026-06-10",
        "end": "2026-07-07"
      },
      {
        "id": "rot_9",
        "type": "work",
        "start": "2026-07-08",
        "end": "2026-08-04"
      },
      {
        "id": "rot_10",
        "type": "leave",
        "start": "2026-08-05",
        "end": "2026-09-01"
      },
      {
        "id": "rot_11",
        "type": "work",
        "start": "2026-09-02",
        "end": "2026-09-29"
      },
      {
        "id": "rot_244",
        "type": "leave",
        "start": "2026-09-30",
        "end": "2026-10-27"
      },
      {
        "id": "rot_13",
        "type": "work",
        "start": "2026-10-28",
        "end": "2026-11-24"
      },
      {
        "id": "rot_14",
        "type": "leave",
        "start": "2026-11-25",
        "end": "2026-12-22"
      },
      {
        "id": "rot_15",
        "type": "work",
        "start": "2026-12-23",
        "end": "2027-01-19"
      },
      {
        "id": "rot_16",
        "type": "leave",
        "start": "2027-01-20",
        "end": "2027-02-16"
      },
      {
        "id": "rot_17",
        "type": "work",
        "start": "2027-02-17",
        "end": "2027-03-16"
      },
      {
        "id": "rot_18",
        "type": "leave",
        "start": "2027-03-17",
        "end": "2027-04-13"
      },
      {
        "id": "rot_19",
        "type": "work",
        "start": "2027-04-14",
        "end": "2027-05-16"
      }
    ],
    "Overrides": [
      {
        "id": "exc_1700000001",
        "type": "sick_leave",
        "start": "2026-07-20",
        "end": "2026-07-25",
        "paidStatus": "full",
        "replacementId": "183",
        "notes": "Medical report submitted"
      }
    ]
  },
  {
    "ID": "183",
    "Name": "Bashar Saeed Salim Al-Jabri",
    "Company": "PetroMasila-BLK53",
    "Department": "Managment",
    "Overrides": [
      {
        "id": "exc_1700000002",
        "type": "standby_cover",
        "start": "2026-07-20",
        "end": "2026-07-25",
        "paidStatus": "full",
        "replacementId": "128",
        "notes": "Covering for Saleh Faraj Salem Al-Jaberi (128)"
      }
    ],
    "Rotations": [
      {
        "id": "rot_20",
        "type": "work",
        "start": "2025-10-29",
        "end": "2025-11-25"
      },
      {
        "id": "rot_21",
        "type": "leave",
        "start": "2025-11-26",
        "end": "2025-12-23"
      },
      {
        "id": "rot_22",
        "type": "work",
        "start": "2025-12-24",
        "end": "2026-01-20"
      },
      {
        "id": "rot_23",
        "type": "leave",
        "start": "2026-01-21",
        "end": "2026-02-17"
      },
      {
        "id": "rot_24",
        "type": "work",
        "start": "2026-02-18",
        "end": "2026-03-17"
      },
      {
        "id": "rot_25",
        "type": "leave",
        "start": "2026-03-18",
        "end": "2026-04-14"
      },
      {
        "id": "rot_26",
        "type": "work",
        "start": "2026-04-15",
        "end": "2026-05-12"
      },
      {
        "id": "rot_27",
        "type": "leave",
        "start": "2026-05-13",
        "end": "2026-06-09"
      },
      {
        "id": "rot_28",
        "type": "work",
        "start": "2026-06-10",
        "end": "2026-07-07"
      },
      {
        "id": "rot_29",
        "type": "leave",
        "start": "2026-07-08",
        "end": "2026-08-04"
      },
      {
        "id": "rot_30",
        "type": "work",
        "start": "2026-08-05",
        "end": "2026-09-01"
      },
      {
        "id": "rot_31",
        "type": "leave",
        "start": "2026-09-02",
        "end": "2026-09-29"
      },
      {
        "id": "rot_32",
        "type": "work",
        "start": "2026-09-30",
        "end": "2026-10-27"
      },
      {
        "id": "rot_33",
        "type": "leave",
        "start": "2026-10-28",
        "end": "2026-11-24"
      },
      {
        "id": "rot_34",
        "type": "work",
        "start": "2026-11-25",
        "end": "2026-12-22"
      },
      {
        "id": "rot_35",
        "type": "leave",
        "start": "2026-12-23",
        "end": "2027-01-19"
      },
      {
        "id": "rot_36",
        "type": "work",
        "start": "2027-01-20",
        "end": "2027-02-16"
      },
      {
        "id": "rot_37",
        "type": "leave",
        "start": "2027-02-17",
        "end": "2027-03-16"
      }
    ]
  },
  {
    "ID": "112",
    "Name": "Abdullah Salem Abdullah Al-Zubaidi",
    "Company": "PetroMasila-BLK53",
    "Department": "Managment",
    "Rotations": [
      {
        "id": "rot_38",
        "type": "work",
        "start": "2025-11-12",
        "end": "2025-12-09"
      },
      {
        "id": "rot_39",
        "type": "leave",
        "start": "2025-12-10",
        "end": "2026-01-06"
      },
      {
        "id": "rot_40",
        "type": "work",
        "start": "2026-01-07",
        "end": "2026-01-27"
      },
      {
        "id": "rot_41",
        "type": "leave",
        "start": "2026-01-28",
        "end": "2026-02-16"
      },
      {
        "id": "rot_42",
        "type": "work",
        "start": "2026-02-17",
        "end": "2026-03-07"
      },
      {
        "id": "rot_43",
        "type": "leave",
        "start": "2026-03-08",
        "end": "2026-03-28"
      },
      {
        "id": "rot_44",
        "type": "work",
        "start": "2026-03-29",
        "end": "2026-04-01"
      },
      {
        "id": "rot_45",
        "type": "leave",
        "start": "2026-04-02",
        "end": "2026-04-11"
      },
      {
        "id": "rot_46",
        "type": "work",
        "start": "2026-04-12",
        "end": "2026-05-09"
      },
      {
        "id": "rot_47",
        "type": "leave",
        "start": "2026-05-10",
        "end": "2026-06-06"
      },
      {
        "id": "rot_48",
        "type": "work",
        "start": "2026-06-07",
        "end": "2026-07-04"
      }
    ]
  },
  {
    "ID": "265",
    "Name": "Adel Saleh Abdullah Al-Jabri",
    "Company": "PetroMasila-BLK53",
    "Department": "Managment",
    "Rotations": [
      {
        "id": "rot_49",
        "type": "work",
        "start": "2025-10-16",
        "end": "2025-11-12"
      },
      {
        "id": "rot_50",
        "type": "leave",
        "start": "2025-11-13",
        "end": "2025-12-10"
      },
      {
        "id": "rot_51",
        "type": "work",
        "start": "2025-12-11",
        "end": "2026-01-06"
      },
      {
        "id": "rot_52",
        "type": "leave",
        "start": "2026-01-07",
        "end": "2026-01-27"
      },
      {
        "id": "rot_53",
        "type": "work",
        "start": "2026-01-28",
        "end": "2026-02-24"
      },
      {
        "id": "rot_54",
        "type": "leave",
        "start": "2026-02-25",
        "end": "2026-03-28"
      },
      {
        "id": "rot_55",
        "type": "work",
        "start": "2026-03-29",
        "end": "2026-04-22"
      },
      {
        "id": "rot_56",
        "type": "leave",
        "start": "2026-04-23",
        "end": "2026-05-06"
      },
      {
        "id": "rot_57",
        "type": "work",
        "start": "2026-05-07",
        "end": "2026-05-23"
      },
      {
        "id": "rot_58",
        "type": "leave",
        "start": "2026-05-24",
        "end": "2026-06-14"
      },
      {
        "id": "rot_59",
        "type": "work",
        "start": "2026-06-15",
        "end": "2026-07-11"
      }
    ]
  },
  {
    "ID": "177",
    "Name": "Faize Abdulrab Ayoob Markeb",
    "Company": "PetroMasila-BLK53",
    "Department": "Managment",
    "Rotations": [
      {
        "id": "rot_60",
        "type": "work",
        "start": "2025-10-20",
        "end": "2025-11-16"
      },
      {
        "id": "rot_61",
        "type": "leave",
        "start": "2025-11-17",
        "end": "2025-12-14"
      },
      {
        "id": "rot_62",
        "type": "work",
        "start": "2025-12-15",
        "end": "2026-01-04"
      },
      {
        "id": "rot_63",
        "type": "leave",
        "start": "2026-01-05",
        "end": "2026-02-03"
      },
      {
        "id": "rot_64",
        "type": "work",
        "start": "2026-02-04",
        "end": "2026-02-22"
      },
      {
        "id": "rot_65",
        "type": "leave",
        "start": "2026-02-23",
        "end": "2026-02-27"
      },
      {
        "id": "rot_66",
        "type": "work",
        "start": "2026-02-28",
        "end": "2026-03-06"
      },
      {
        "id": "rot_67",
        "type": "leave",
        "start": "2026-03-07",
        "end": "2026-03-28"
      },
      {
        "id": "rot_68",
        "type": "work",
        "start": "2026-03-29",
        "end": "2026-04-17"
      },
      {
        "id": "rot_69",
        "type": "leave",
        "start": "2026-04-18",
        "end": "2026-05-01"
      },
      {
        "id": "rot_70",
        "type": "work",
        "start": "2026-05-02",
        "end": "2026-05-15"
      },
      {
        "id": "rot_71",
        "type": "leave",
        "start": "2026-05-16",
        "end": "2026-06-12"
      },
      {
        "id": "rot_72",
        "type": "work",
        "start": "2026-06-13",
        "end": "2026-07-10"
      }
    ]
  },
  {
    "ID": "240",
    "Name": "Waleed Mahmoud Salem Ba Saadah",
    "Company": "PetroMasila-BLK53",
    "Department": "Managment",
    "Rotations": [
      {
        "id": "rot_73",
        "type": "work",
        "start": "2025-10-23",
        "end": "2025-11-19"
      },
      {
        "id": "rot_74",
        "type": "leave",
        "start": "2025-11-20",
        "end": "2025-12-17"
      },
      {
        "id": "rot_75",
        "type": "work",
        "start": "2025-12-18",
        "end": "2026-01-14"
      },
      {
        "id": "rot_76",
        "type": "leave",
        "start": "2026-01-15",
        "end": "2026-02-11"
      },
      {
        "id": "rot_77",
        "type": "work",
        "start": "2026-02-12",
        "end": "2026-03-11"
      },
      {
        "id": "rot_78",
        "type": "leave",
        "start": "2026-03-12",
        "end": "2026-04-08"
      },
      {
        "id": "rot_79",
        "type": "work",
        "start": "2026-04-09",
        "end": "2026-04-26"
      },
      {
        "id": "rot_80",
        "type": "leave",
        "start": "2026-04-27",
        "end": "2026-05-14"
      },
      {
        "id": "rot_81",
        "type": "work",
        "start": "2026-05-15",
        "end": "2026-06-13"
      },
      {
        "id": "rot_82",
        "type": "leave",
        "start": "2026-06-14",
        "end": "2026-07-13"
      },
      {
        "id": "rot_83",
        "type": "work",
        "start": "2026-07-14",
        "end": "2026-08-10"
      }
    ]
  },
  {
    "ID": "1000",
    "Name": "Bader Omar Al-Jaberi",
    "Company": "PetroMasila-BLK53",
    "Department": "Managment",
    "Rotations": [
      {
        "id": "rot_84",
        "type": "work",
        "start": "2025-11-20",
        "end": "2025-12-17"
      },
      {
        "id": "rot_85",
        "type": "leave",
        "start": "2025-12-18",
        "end": "2026-01-14"
      },
      {
        "id": "rot_86",
        "type": "work",
        "start": "2026-01-15",
        "end": "2026-02-11"
      },
      {
        "id": "rot_87",
        "type": "leave",
        "start": "2026-02-12",
        "end": "2026-03-11"
      },
      {
        "id": "rot_88",
        "type": "work",
        "start": "2026-03-12",
        "end": "2026-04-08"
      },
      {
        "id": "rot_89",
        "type": "leave",
        "start": "2026-04-09",
        "end": "2026-04-26"
      },
      {
        "id": "rot_90",
        "type": "work",
        "start": "2026-04-27",
        "end": "2026-05-14"
      },
      {
        "id": "rot_91",
        "type": "leave",
        "start": "2026-05-15",
        "end": "2026-06-13"
      },
      {
        "id": "rot_92",
        "type": "work",
        "start": "2026-06-14",
        "end": "2026-07-13"
      },
      {
        "id": "rot_93",
        "type": "leave",
        "start": "2026-07-14",
        "end": "2026-08-10"
      }
    ]
  },
  {
    "ID": "219",
    "Name": "Muneer Ahmed Mahfoudh  Bin Zailaa",
    "Company": "PetroMasila-BLK53",
    "Department": "Managment",
    "Rotations": [
      {
        "id": "rot_94",
        "type": "work",
        "start": "2025-10-27",
        "end": "2025-11-16"
      },
      {
        "id": "rot_95",
        "type": "leave",
        "start": "2025-11-17",
        "end": "2025-12-14"
      },
      {
        "id": "rot_96",
        "type": "work",
        "start": "2025-12-15",
        "end": "2026-01-11"
      },
      {
        "id": "rot_97",
        "type": "leave",
        "start": "2026-01-12",
        "end": "2026-02-07"
      },
      {
        "id": "rot_98",
        "type": "work",
        "start": "2026-02-08",
        "end": "2026-03-06"
      },
      {
        "id": "rot_99",
        "type": "leave",
        "start": "2026-03-07",
        "end": "2026-04-03"
      },
      {
        "id": "rot_100",
        "type": "work",
        "start": "2026-04-04",
        "end": "2026-04-25"
      },
      {
        "id": "rot_101",
        "type": "leave",
        "start": "2026-05-08",
        "end": "2026-06-12"
      },
      {
        "id": "rot_102",
        "type": "work",
        "start": "2026-06-13",
        "end": "2026-07-14"
      }
    ]
  },
  {
    "ID": "273",
    "Name": "Mohammed Karama Yamani Al-Tamimi",
    "Company": "PetroMasila-BLK53",
    "Department": "Managment",
    "Rotations": [
      {
        "id": "rot_103",
        "type": "work",
        "start": "2025-11-17",
        "end": "2025-12-14"
      },
      {
        "id": "rot_104",
        "type": "leave",
        "start": "2025-12-15",
        "end": "2026-01-11"
      },
      {
        "id": "rot_105",
        "type": "work",
        "start": "2026-01-12",
        "end": "2026-02-07"
      },
      {
        "id": "rot_106",
        "type": "leave",
        "start": "2026-02-08",
        "end": "2026-03-06"
      },
      {
        "id": "rot_107",
        "type": "work",
        "start": "2026-03-07",
        "end": "2026-04-03"
      },
      {
        "id": "rot_108",
        "type": "leave",
        "start": "2026-04-04",
        "end": "2026-04-25"
      },
      {
        "id": "rot_109",
        "type": "work",
        "start": "2026-04-26",
        "end": "2026-05-17"
      },
      {
        "id": "rot_110",
        "type": "leave",
        "start": "2026-05-18",
        "end": "2026-06-14"
      },
      {
        "id": "rot_111",
        "type": "work",
        "start": "2026-06-15",
        "end": "2026-07-12"
      },
      {
        "id": "rot_112",
        "type": "leave",
        "start": "2026-07-13",
        "end": "2026-08-09"
      },
      {
        "id": "rot_113",
        "type": "work",
        "start": "2026-08-10",
        "end": "2026-09-06"
      },
      {
        "id": "rot_114",
        "type": "leave",
        "start": "2026-09-07",
        "end": "2026-10-04"
      }
    ]
  },
  {
    "ID": "262",
    "Name": "Mohamed Hussain Al-Aidroos",
    "Company": "PetroMasila-BLK53",
    "Department": "Managment",
    "Rotations": [
      {
        "id": "rot_115",
        "type": "work",
        "start": "2025-10-18",
        "end": "2025-11-14"
      },
      {
        "id": "rot_116",
        "type": "leave",
        "start": "2025-11-15",
        "end": "2025-12-12"
      },
      {
        "id": "rot_117",
        "type": "work",
        "start": "2025-12-13",
        "end": "2026-01-07"
      },
      {
        "id": "rot_118",
        "type": "leave",
        "start": "2026-01-08",
        "end": "2026-02-04"
      },
      {
        "id": "rot_119",
        "type": "work",
        "start": "2026-02-05",
        "end": "2026-03-03"
      },
      {
        "id": "rot_120",
        "type": "leave",
        "start": "2026-03-04",
        "end": "2026-04-01"
      },
      {
        "id": "rot_121",
        "type": "work",
        "start": "2026-04-02",
        "end": "2026-04-29"
      },
      {
        "id": "rot_122",
        "type": "leave",
        "start": "2026-04-30",
        "end": "2026-05-13"
      },
      {
        "id": "rot_123",
        "type": "work",
        "start": "2026-05-14",
        "end": "2026-06-14"
      },
      {
        "id": "rot_124",
        "type": "leave",
        "start": "2026-06-15",
        "end": "2026-07-14"
      },
      {
        "id": "rot_125",
        "type": "work",
        "start": "2026-07-15",
        "end": "2026-08-09"
      },
      {
        "id": "rot_126",
        "type": "leave",
        "start": "2026-08-10",
        "end": "2026-09-06"
      },
      {
        "id": "rot_127",
        "type": "work",
        "start": "2026-09-07",
        "end": "2026-10-04"
      }
    ]
  },
  {
    "ID": "258",
    "Name": "Ahmed Mohamed Bahafin",
    "Company": "PetroMasila-BLK53",
    "Department": "Managment",
    "Rotations": [
      {
        "id": "rot_128",
        "type": "work",
        "start": "2025-11-15",
        "end": "2025-12-12"
      },
      {
        "id": "rot_129",
        "type": "leave",
        "start": "2025-12-13",
        "end": "2026-01-07"
      },
      {
        "id": "rot_130",
        "type": "work",
        "start": "2026-01-08",
        "end": "2026-02-04"
      },
      {
        "id": "rot_131",
        "type": "leave",
        "start": "2026-02-05",
        "end": "2026-03-04"
      },
      {
        "id": "rot_132",
        "type": "work",
        "start": "2026-03-05",
        "end": "2026-04-01"
      },
      {
        "id": "rot_133",
        "type": "leave",
        "start": "2026-04-02",
        "end": "2026-04-29"
      },
      {
        "id": "rot_134",
        "type": "work",
        "start": "2026-04-30",
        "end": "2026-05-13"
      },
      {
        "id": "rot_135",
        "type": "leave",
        "start": "2026-05-14",
        "end": "2026-06-14"
      },
      {
        "id": "rot_136",
        "type": "work",
        "start": "2026-06-15",
        "end": "2026-07-14"
      },
      {
        "id": "rot_137",
        "type": "leave",
        "start": "2026-07-15",
        "end": "2026-08-09"
      },
      {
        "id": "rot_138",
        "type": "work",
        "start": "2026-08-10",
        "end": "2026-09-06"
      },
      {
        "id": "rot_139",
        "type": "leave",
        "start": "2026-09-07",
        "end": "2026-10-04"
      }
    ]
  },
  {
    "ID": "153",
    "Name": "Niyazi Mustafa Yousef Omar",
    "Company": "PetroMasila-BLK53",
    "Department": "Managment",
    "Rotations": [
      {
        "id": "rot_140",
        "type": "work",
        "start": "2025-11-26",
        "end": "2025-12-23"
      },
      {
        "id": "rot_141",
        "type": "leave",
        "start": "2025-12-24",
        "end": "2026-01-13"
      },
      {
        "id": "rot_142",
        "type": "leave",
        "start": "2026-04-25",
        "end": "2026-05-30"
      },
      {
        "id": "rot_143",
        "type": "work",
        "start": "2026-05-31",
        "end": "2026-06-21"
      }
    ]
  },
  {
    "ID": "253",
    "Name": "Mohammed Soror Nasser Al-Ban",
    "Company": "PetroMasila-BLK53",
    "Department": "Managment",
    "Rotations": [
      {
        "id": "rot_144",
        "type": "work",
        "start": "2025-10-15",
        "end": "2025-11-14"
      },
      {
        "id": "rot_145",
        "type": "leave",
        "start": "2025-11-15",
        "end": "2025-12-05"
      },
      {
        "id": "rot_146",
        "type": "work",
        "start": "2025-12-06",
        "end": "2025-12-30"
      },
      {
        "id": "rot_147",
        "type": "leave",
        "start": "2025-12-31",
        "end": "2026-01-26"
      },
      {
        "id": "rot_148",
        "type": "work",
        "start": "2026-01-27",
        "end": "2026-02-26"
      },
      {
        "id": "rot_149",
        "type": "leave",
        "start": "2026-02-27",
        "end": "2026-03-27"
      },
      {
        "id": "rot_150",
        "type": "work",
        "start": "2026-03-28",
        "end": "2026-05-01"
      },
      {
        "id": "rot_151",
        "type": "leave",
        "start": "2026-05-02",
        "end": "2026-06-05"
      },
      {
        "id": "rot_152",
        "type": "work",
        "start": "2026-06-06",
        "end": "2026-07-10"
      },
      {
        "id": "rot_153",
        "type": "leave",
        "start": "2026-07-11",
        "end": "2026-07-17"
      }
    ]
  },
  {
    "ID": "297",
    "Name": "Mohamed Salem Awadh Bahashwan",
    "Company": "PetroMasila-BLK53",
    "Department": "Managment",
    "Rotations": [
      {
        "id": "rot_154",
        "type": "work",
        "start": "2025-10-27",
        "end": "2025-11-23"
      },
      {
        "id": "rot_155",
        "type": "leave",
        "start": "2025-11-24",
        "end": "2025-12-21"
      },
      {
        "id": "rot_156",
        "type": "work",
        "start": "2025-12-22",
        "end": "2026-01-12"
      },
      {
        "id": "rot_157",
        "type": "leave",
        "start": "2026-01-13",
        "end": "2026-02-03"
      },
      {
        "id": "rot_158",
        "type": "work",
        "start": "2026-02-04",
        "end": "2026-03-03"
      },
      {
        "id": "rot_159",
        "type": "leave",
        "start": "2026-03-04",
        "end": "2026-03-31"
      },
      {
        "id": "rot_160",
        "type": "work",
        "start": "2026-04-01",
        "end": "2026-04-21"
      },
      {
        "id": "rot_161",
        "type": "leave",
        "start": "2026-04-22",
        "end": "2026-05-12"
      },
      {
        "id": "rot_162",
        "type": "work",
        "start": "2026-05-13",
        "end": "2026-06-09"
      },
      {
        "id": "rot_163",
        "type": "leave",
        "start": "2026-06-10",
        "end": "2026-07-10"
      },
      {
        "id": "rot_164",
        "type": "work",
        "start": "2026-07-11",
        "end": "2026-08-10"
      },
      {
        "id": "rot_165",
        "type": "leave",
        "start": "2026-08-11",
        "end": "2026-09-07"
      },
      {
        "id": "rot_166",
        "type": "work",
        "start": "2026-09-08",
        "end": "2026-10-05"
      },
      {
        "id": "rot_167",
        "type": "leave",
        "start": "2026-10-06",
        "end": "2026-11-02"
      },
      {
        "id": "rot_168",
        "type": "work",
        "start": "2026-11-03",
        "end": "2026-11-30"
      },
      {
        "id": "rot_169",
        "type": "leave",
        "start": "2026-12-01",
        "end": "2026-12-28"
      }
    ]
  },
  {
    "ID": "1001",
    "Name": "Omar Hasan Bajari",
    "Company": "PetroMasila-BLK53",
    "Department": "Managment",
    "Rotations": [
      {
        "id": "rot_170",
        "type": "work",
        "start": "2025-11-24",
        "end": "2025-12-21"
      },
      {
        "id": "rot_171",
        "type": "leave",
        "start": "2025-12-22",
        "end": "2026-01-12"
      },
      {
        "id": "rot_172",
        "type": "work",
        "start": "2026-01-13",
        "end": "2026-02-03"
      },
      {
        "id": "rot_173",
        "type": "leave",
        "start": "2026-02-04",
        "end": "2026-03-03"
      },
      {
        "id": "rot_174",
        "type": "work",
        "start": "2026-03-04",
        "end": "2026-03-31"
      },
      {
        "id": "rot_175",
        "type": "leave",
        "start": "2026-04-01",
        "end": "2026-04-21"
      },
      {
        "id": "rot_176",
        "type": "work",
        "start": "2026-04-22",
        "end": "2026-05-12"
      },
      {
        "id": "rot_177",
        "type": "leave",
        "start": "2026-05-13",
        "end": "2026-06-09"
      },
      {
        "id": "rot_178",
        "type": "work",
        "start": "2026-06-10",
        "end": "2026-07-10"
      },
      {
        "id": "rot_179",
        "type": "leave",
        "start": "2026-07-11",
        "end": "2026-08-10"
      },
      {
        "id": "rot_180",
        "type": "work",
        "start": "2026-08-11",
        "end": "2026-09-07"
      },
      {
        "id": "rot_181",
        "type": "leave",
        "start": "2026-09-08",
        "end": "2026-10-05"
      },
      {
        "id": "rot_182",
        "type": "work",
        "start": "2026-10-06",
        "end": "2026-11-02"
      },
      {
        "id": "rot_183",
        "type": "leave",
        "start": "2026-11-03",
        "end": "2026-11-30"
      },
      {
        "id": "rot_184",
        "type": "work",
        "start": "2026-12-01",
        "end": "2026-12-28"
      }
    ]
  },
  {
    "ID": "120",
    "Name": "Nasser Hussain Awadh Bin Taleb",
    "Company": "PetroMasila-BLK53",
    "Department": "Managment",
    "Rotations": [
      {
        "id": "rot_185",
        "type": "work",
        "start": "2025-11-09",
        "end": "2025-12-06"
      },
      {
        "id": "rot_186",
        "type": "leave",
        "start": "2025-12-07",
        "end": "2026-01-10"
      },
      {
        "id": "rot_187",
        "type": "work",
        "start": "2026-01-11",
        "end": "2026-02-14"
      },
      {
        "id": "rot_188",
        "type": "leave",
        "start": "2026-02-15",
        "end": "2026-03-28"
      },
      {
        "id": "rot_189",
        "type": "work",
        "start": "2026-03-29",
        "end": "2026-05-02"
      },
      {
        "id": "rot_190",
        "type": "leave",
        "start": "2026-05-03",
        "end": "2026-06-06"
      },
      {
        "id": "rot_191",
        "type": "work",
        "start": "2026-06-07",
        "end": "2026-06-22"
      },
      {
        "id": "rot_192",
        "type": "leave",
        "start": "2026-06-23",
        "end": "2026-07-08"
      },
      {
        "id": "rot_193",
        "type": "work",
        "start": "2026-11-22",
        "end": "2026-12-19"
      },
      {
        "id": "rot_194",
        "type": "leave",
        "start": "2026-12-20",
        "end": "2027-01-16"
      },
      {
        "id": "rot_195",
        "type": "work",
        "start": "2027-01-17",
        "end": "2027-02-13"
      },
      {
        "id": "rot_196",
        "type": "leave",
        "start": "2027-02-14",
        "end": "2027-03-13"
      }
    ]
  },
  {
    "ID": "255",
    "Name": "Abdulmajeed Essa Omar Ba Abaad",
    "Company": "PetroMasila-BLK53",
    "Department": "Managment",
    "Rotations": [
      {
        "id": "rot_197",
        "type": "work",
        "start": "2025-10-21",
        "end": "2025-11-22"
      },
      {
        "id": "rot_198",
        "type": "leave",
        "start": "2025-11-23",
        "end": "2025-12-20"
      },
      {
        "id": "rot_199",
        "type": "work",
        "start": "2025-12-21",
        "end": "2026-01-03"
      },
      {
        "id": "rot_200",
        "type": "leave",
        "start": "2026-01-04",
        "end": "2026-01-17"
      },
      {
        "id": "rot_201",
        "type": "work",
        "start": "2026-01-18",
        "end": "2026-02-21"
      },
      {
        "id": "rot_202",
        "type": "leave",
        "start": "2026-02-22",
        "end": "2026-03-28"
      },
      {
        "id": "rot_203",
        "type": "work",
        "start": "2026-03-29",
        "end": "2026-04-25"
      },
      {
        "id": "rot_204",
        "type": "leave",
        "start": "2026-04-26",
        "end": "2026-05-09"
      },
      {
        "id": "rot_205",
        "type": "work",
        "start": "2026-05-10",
        "end": "2026-05-23"
      },
      {
        "id": "rot_206",
        "type": "leave",
        "start": "2026-05-24",
        "end": "2026-06-21"
      },
      {
        "id": "rot_207",
        "type": "work",
        "start": "2026-06-22",
        "end": "2026-07-11"
      },
      {
        "id": "rot_208",
        "type": "leave",
        "start": "2026-07-12",
        "end": "2026-08-15"
      },
      {
        "id": "rot_209",
        "type": "work",
        "start": "2026-08-16",
        "end": "2026-09-12"
      },
      {
        "id": "rot_210",
        "type": "leave",
        "start": "2026-09-13",
        "end": "2026-10-10"
      },
      {
        "id": "rot_211",
        "type": "work",
        "start": "2026-10-11",
        "end": "2026-11-07"
      },
      {
        "id": "rot_212",
        "type": "leave",
        "start": "2026-11-08",
        "end": "2026-12-05"
      }
    ]
  },
  {
    "ID": "244",
    "Name": "Aref Awadh Salem Ba Wazeer",
    "Company": "PetroMasila-BLK53",
    "Department": "Security",
    "Rotations": [
      {
        "id": "rot_213",
        "type": "work",
        "start": "2025-11-10",
        "end": "2025-12-09"
      },
      {
        "id": "rot_214",
        "type": "leave",
        "start": "2025-12-10",
        "end": "2026-01-01"
      },
      {
        "id": "rot_215",
        "type": "work",
        "start": "2026-01-02",
        "end": "2026-01-05"
      },
      {
        "id": "rot_216",
        "type": "leave",
        "start": "2026-01-06",
        "end": "2026-01-07"
      },
      {
        "id": "rot_217",
        "type": "work",
        "start": "2026-01-08",
        "end": "2026-02-03"
      },
      {
        "id": "rot_218",
        "type": "leave",
        "start": "2026-02-04",
        "end": "2026-03-03"
      },
      {
        "id": "rot_219",
        "type": "work",
        "start": "2026-03-04",
        "end": "2026-03-31"
      },
      {
        "id": "rot_220",
        "type": "leave",
        "start": "2026-04-01",
        "end": "2026-04-21"
      },
      {
        "id": "rot_221",
        "type": "work",
        "start": "2026-04-22",
        "end": "2026-05-12"
      },
      {
        "id": "rot_222",
        "type": "leave",
        "start": "2026-05-13",
        "end": "2026-06-09"
      },
      {
        "id": "rot_223",
        "type": "work",
        "start": "2026-06-10",
        "end": "2026-07-07"
      }
    ]
  },
  {
    "ID": "190",
    "Name": "Abdulqader Saleh Ali Al-Zubidi",
    "Company": "PetroMasila-BLK53",
    "Department": "Security",
    "Rotations": [
      {
        "id": "rot_224",
        "type": "work",
        "start": "2025-10-13",
        "end": "2025-11-09"
      },
      {
        "id": "rot_225",
        "type": "leave",
        "start": "2025-11-10",
        "end": "2025-12-07"
      },
      {
        "id": "rot_226",
        "type": "work",
        "start": "2025-12-08",
        "end": "2026-01-08"
      },
      {
        "id": "rot_227",
        "type": "leave",
        "start": "2026-01-09",
        "end": "2026-02-03"
      },
      {
        "id": "rot_228",
        "type": "work",
        "start": "2026-02-04",
        "end": "2026-03-03"
      },
      {
        "id": "rot_229",
        "type": "leave",
        "start": "2026-03-04",
        "end": "2026-03-31"
      },
      {
        "id": "rot_230",
        "type": "work",
        "start": "2026-04-01",
        "end": "2026-04-21"
      },
      {
        "id": "rot_231",
        "type": "leave",
        "start": "2026-04-22",
        "end": "2026-05-12"
      },
      {
        "id": "rot_232",
        "type": "work",
        "start": "2026-05-13",
        "end": "2026-06-09"
      },
      {
        "id": "rot_233",
        "type": "leave",
        "start": "2026-06-10",
        "end": "2026-07-07"
      }
    ]
  },
  {
    "ID": "241",
    "Name": "Ahmed Ali Salem Ba Atwa",
    "Company": "PetroMasila-BLK53",
    "Department": "Security",
    "Rotations": [
      {
        "id": "rot_234",
        "type": "work",
        "start": "2025-10-11",
        "end": "2025-11-07"
      },
      {
        "id": "rot_235",
        "type": "leave",
        "start": "2025-11-08",
        "end": "2025-12-05"
      },
      {
        "id": "rot_236",
        "type": "work",
        "start": "2025-12-06",
        "end": "2026-01-04"
      },
      {
        "id": "rot_237",
        "type": "leave",
        "start": "2026-01-05",
        "end": "2026-02-03"
      },
      {
        "id": "rot_238",
        "type": "work",
        "start": "2026-02-04",
        "end": "2026-03-03"
      },
      {
        "id": "rot_239",
        "type": "leave",
        "start": "2026-03-04",
        "end": "2026-03-31"
      },
      {
        "id": "rot_240",
        "type": "work",
        "start": "2026-04-01",
        "end": "2026-04-21"
      },
      {
        "id": "rot_241",
        "type": "leave",
        "start": "2026-04-22",
        "end": "2026-05-12"
      },
      {
        "id": "rot_242",
        "type": "work",
        "start": "2026-05-13",
        "end": "2026-06-09"
      },
      {
        "id": "rot_243",
        "type": "leave",
        "start": "2026-06-10",
        "end": "2026-07-06"
      },
      {
        "id": "rot_244",
        "type": "work",
        "start": "2026-07-07",
        "end": "2026-08-02"
      },
      {
        "id": "rot_245",
        "type": "leave",
        "start": "2026-08-03",
        "end": "2026-08-30"
      },
      {
        "id": "rot_246",
        "type": "work",
        "start": "2026-08-31",
        "end": "2026-09-29"
      }
    ]
  },
  {
    "ID": "114",
    "Name": "Yousef Mohamed Awadh Al-Hamoodi",
    "Company": "PetroMasila-BLK53",
    "Department": "Security",
    "Rotations": [
      {
        "id": "rot_247",
        "type": "work",
        "start": "2025-11-08",
        "end": "2025-12-05"
      },
      {
        "id": "rot_248",
        "type": "leave",
        "start": "2025-12-06",
        "end": "2026-01-04"
      },
      {
        "id": "rot_249",
        "type": "work",
        "start": "2026-01-05",
        "end": "2026-02-03"
      },
      {
        "id": "rot_250",
        "type": "leave",
        "start": "2026-02-04",
        "end": "2026-03-03"
      },
      {
        "id": "rot_251",
        "type": "work",
        "start": "2026-03-04",
        "end": "2026-03-31"
      },
      {
        "id": "rot_252",
        "type": "leave",
        "start": "2026-04-01",
        "end": "2026-04-21"
      },
      {
        "id": "rot_253",
        "type": "work",
        "start": "2026-04-22",
        "end": "2026-05-12"
      },
      {
        "id": "rot_254",
        "type": "leave",
        "start": "2026-05-13",
        "end": "2026-06-09"
      },
      {
        "id": "rot_255",
        "type": "work",
        "start": "2026-06-10",
        "end": "2026-07-10"
      },
      {
        "id": "rot_256",
        "type": "leave",
        "start": "2026-07-11",
        "end": "2026-08-02"
      },
      {
        "id": "rot_257",
        "type": "work",
        "start": "2026-08-03",
        "end": "2026-08-30"
      },
      {
        "id": "rot_258",
        "type": "leave",
        "start": "2026-08-31",
        "end": "2026-09-29"
      }
    ]
  },
  {
    "ID": "130",
    "Name": "Ali Salem Mubark AlSharkhi",
    "Company": "PetroMasila-BLK53",
    "Department": "Security",
    "Rotations": [
      {
        "id": "rot_259",
        "type": "work",
        "start": "2025-10-11",
        "end": "2025-11-07"
      },
      {
        "id": "rot_260",
        "type": "leave",
        "start": "2025-11-08",
        "end": "2025-12-07"
      },
      {
        "id": "rot_261",
        "type": "work",
        "start": "2025-12-08",
        "end": "2026-01-06"
      },
      {
        "id": "rot_262",
        "type": "leave",
        "start": "2026-01-07",
        "end": "2026-02-03"
      },
      {
        "id": "rot_263",
        "type": "work",
        "start": "2026-02-04",
        "end": "2026-03-03"
      },
      {
        "id": "rot_264",
        "type": "leave",
        "start": "2026-03-04",
        "end": "2026-03-31"
      },
      {
        "id": "rot_265",
        "type": "work",
        "start": "2026-04-01",
        "end": "2026-04-20"
      },
      {
        "id": "rot_266",
        "type": "leave",
        "start": "2026-04-21",
        "end": "2026-05-11"
      },
      {
        "id": "rot_267",
        "type": "work",
        "start": "2026-05-12",
        "end": "2026-06-08"
      },
      {
        "id": "rot_268",
        "type": "leave",
        "start": "2026-06-09",
        "end": "2026-07-06"
      }
    ]
  },
  {
    "ID": "147",
    "Name": "Yaser Saleh Rabea'a Mallas",
    "Company": "PetroMasila-BLK53",
    "Department": "Security",
    "Rotations": [
      {
        "id": "rot_269",
        "type": "work",
        "start": "2025-11-08",
        "end": "2025-12-07"
      },
      {
        "id": "rot_270",
        "type": "leave",
        "start": "2025-12-08",
        "end": "2026-01-06"
      },
      {
        "id": "rot_271",
        "type": "work",
        "start": "2026-01-07",
        "end": "2026-02-03"
      },
      {
        "id": "rot_272",
        "type": "leave",
        "start": "2026-02-04",
        "end": "2026-03-03"
      },
      {
        "id": "rot_273",
        "type": "work",
        "start": "2026-03-04",
        "end": "2026-03-31"
      },
      {
        "id": "rot_274",
        "type": "leave",
        "start": "2026-04-01",
        "end": "2026-04-21"
      },
      {
        "id": "rot_275",
        "type": "work",
        "start": "2026-04-22",
        "end": "2026-05-11"
      },
      {
        "id": "rot_276",
        "type": "leave",
        "start": "2026-05-12",
        "end": "2026-06-08"
      },
      {
        "id": "rot_277",
        "type": "work",
        "start": "2026-06-09",
        "end": "2026-07-06"
      }
    ]
  },
  {
    "ID": "113",
    "Name": "Eissa Zain Abdullah Al-Zubaidi",
    "Company": "PetroMasila-BLK53",
    "Department": "Security",
    "Rotations": [
      {
        "id": "rot_278",
        "type": "work",
        "start": "2025-10-12",
        "end": "2025-11-08"
      },
      {
        "id": "rot_279",
        "type": "leave",
        "start": "2025-11-09",
        "end": "2025-12-08"
      },
      {
        "id": "rot_280",
        "type": "work",
        "start": "2025-12-09",
        "end": "2026-01-07"
      },
      {
        "id": "rot_281",
        "type": "leave",
        "start": "2026-01-08",
        "end": "2026-02-04"
      },
      {
        "id": "rot_282",
        "type": "work",
        "start": "2026-02-05",
        "end": "2026-03-04"
      },
      {
        "id": "rot_283",
        "type": "leave",
        "start": "2026-03-05",
        "end": "2026-04-01"
      },
      {
        "id": "rot_284",
        "type": "work",
        "start": "2026-04-02",
        "end": "2026-04-22"
      },
      {
        "id": "rot_285",
        "type": "leave",
        "start": "2026-04-23",
        "end": "2026-05-13"
      },
      {
        "id": "rot_286",
        "type": "work",
        "start": "2026-05-14",
        "end": "2026-06-10"
      },
      {
        "id": "rot_287",
        "type": "leave",
        "start": "2026-06-11",
        "end": "2026-07-08"
      }
    ]
  },
  {
    "ID": "293",
    "Name": "Abdullah Ahmed Hussain Al-Aydaroos",
    "Company": "PetroMasila-BLK53",
    "Department": "Security",
    "Rotations": [
      {
        "id": "rot_288",
        "type": "work",
        "start": "2025-11-09",
        "end": "2025-12-08"
      },
      {
        "id": "rot_289",
        "type": "leave",
        "start": "2025-12-09",
        "end": "2026-01-07"
      },
      {
        "id": "rot_290",
        "type": "work",
        "start": "2026-01-08",
        "end": "2026-02-04"
      },
      {
        "id": "rot_291",
        "type": "leave",
        "start": "2026-02-05",
        "end": "2026-03-04"
      },
      {
        "id": "rot_292",
        "type": "work",
        "start": "2026-03-05",
        "end": "2026-04-01"
      },
      {
        "id": "rot_293",
        "type": "leave",
        "start": "2026-04-02",
        "end": "2026-04-22"
      },
      {
        "id": "rot_294",
        "type": "work",
        "start": "2026-04-23",
        "end": "2026-05-13"
      },
      {
        "id": "rot_295",
        "type": "leave",
        "start": "2026-05-14",
        "end": "2026-06-10"
      },
      {
        "id": "rot_296",
        "type": "work",
        "start": "2026-06-11",
        "end": "2026-07-08"
      }
    ]
  },
  {
    "ID": "245",
    "Name": "Abdullah Ahmed Brek Bin Humaid",
    "Company": "PetroMasila-BLK53",
    "Department": "Security",
    "Rotations": [
      {
        "id": "rot_297",
        "type": "work",
        "start": "2025-10-02",
        "end": "2025-10-29"
      },
      {
        "id": "rot_298",
        "type": "leave",
        "start": "2025-10-30",
        "end": "2025-11-26"
      },
      {
        "id": "rot_299",
        "type": "work",
        "start": "2025-11-27",
        "end": "2025-12-10"
      },
      {
        "id": "rot_300",
        "type": "leave",
        "start": "2025-12-11",
        "end": "2026-01-07"
      },
      {
        "id": "rot_301",
        "type": "work",
        "start": "2026-01-08",
        "end": "2026-02-04"
      },
      {
        "id": "rot_302",
        "type": "leave",
        "start": "2026-02-05",
        "end": "2026-03-04"
      },
      {
        "id": "rot_303",
        "type": "work",
        "start": "2026-03-05",
        "end": "2026-04-01"
      },
      {
        "id": "rot_304",
        "type": "leave",
        "start": "2026-04-02",
        "end": "2026-04-15"
      },
      {
        "id": "rot_305",
        "type": "work",
        "start": "2026-04-16",
        "end": "2026-05-13"
      },
      {
        "id": "rot_306",
        "type": "leave",
        "start": "2026-05-14",
        "end": "2026-06-10"
      },
      {
        "id": "rot_307",
        "type": "work",
        "start": "2026-06-11",
        "end": "2026-07-08"
      },
      {
        "id": "rot_308",
        "type": "leave",
        "start": "2026-07-09",
        "end": "2026-08-05"
      },
      {
        "id": "rot_309",
        "type": "work",
        "start": "2026-08-06",
        "end": "2026-09-02"
      },
      {
        "id": "rot_310",
        "type": "leave",
        "start": "2026-09-03",
        "end": "2026-09-30"
      }
    ]
  },
  {
    "ID": "148",
    "Name": "Omar Hafeedh Omar Al-Zubidi",
    "Company": "PetroMasila-BLK53",
    "Department": "Security",
    "Rotations": [
      {
        "id": "rot_311",
        "type": "work",
        "start": "2025-10-30",
        "end": "2025-11-26"
      },
      {
        "id": "rot_312",
        "type": "leave",
        "start": "2025-11-27",
        "end": "2025-12-10"
      },
      {
        "id": "rot_313",
        "type": "work",
        "start": "2025-12-11",
        "end": "2026-01-07"
      },
      {
        "id": "rot_314",
        "type": "leave",
        "start": "2026-01-08",
        "end": "2026-02-04"
      },
      {
        "id": "rot_315",
        "type": "work",
        "start": "2026-02-05",
        "end": "2026-03-04"
      },
      {
        "id": "rot_316",
        "type": "leave",
        "start": "2026-03-05",
        "end": "2026-04-01"
      },
      {
        "id": "rot_317",
        "type": "work",
        "start": "2026-04-02",
        "end": "2026-04-15"
      },
      {
        "id": "rot_318",
        "type": "leave",
        "start": "2026-04-16",
        "end": "2026-05-13"
      },
      {
        "id": "rot_319",
        "type": "work",
        "start": "2026-05-14",
        "end": "2026-06-10"
      },
      {
        "id": "rot_320",
        "type": "leave",
        "start": "2026-06-11",
        "end": "2026-07-08"
      },
      {
        "id": "rot_321",
        "type": "work",
        "start": "2026-07-09",
        "end": "2026-08-05"
      },
      {
        "id": "rot_322",
        "type": "leave",
        "start": "2026-08-06",
        "end": "2026-09-02"
      },
      {
        "id": "rot_323",
        "type": "work",
        "start": "2026-09-03",
        "end": "2026-09-30"
      }
    ]
  },
  {
    "ID": "223",
    "Name": "Khaled Mohamed Al-Hamoudi",
    "Company": "PetroMasila-BLK53",
    "Department": "Security",
    "Rotations": [
      {
        "id": "rot_324",
        "type": "work",
        "start": "2025-11-11",
        "end": "2025-12-10"
      },
      {
        "id": "rot_325",
        "type": "leave",
        "start": "2025-12-11",
        "end": "2026-01-09"
      },
      {
        "id": "rot_326",
        "type": "work",
        "start": "2026-01-10",
        "end": "2026-02-06"
      },
      {
        "id": "rot_327",
        "type": "leave",
        "start": "2026-02-07",
        "end": "2026-03-06"
      },
      {
        "id": "rot_328",
        "type": "work",
        "start": "2026-03-07",
        "end": "2026-04-03"
      },
      {
        "id": "rot_329",
        "type": "leave",
        "start": "2026-04-04",
        "end": "2026-04-24"
      },
      {
        "id": "rot_330",
        "type": "work",
        "start": "2026-04-25",
        "end": "2026-05-15"
      },
      {
        "id": "rot_331",
        "type": "leave",
        "start": "2026-05-16",
        "end": "2026-06-12"
      },
      {
        "id": "rot_332",
        "type": "work",
        "start": "2026-06-13",
        "end": "2026-07-10"
      }
    ]
  },
  {
    "ID": "175",
    "Name": "Anees Awedh Bafreej",
    "Company": "PetroMasila-BLK53",
    "Department": "Security",
    "Rotations": [
      {
        "id": "rot_333",
        "type": "work",
        "start": "2025-10-16",
        "end": "2025-11-10"
      },
      {
        "id": "rot_334",
        "type": "leave",
        "start": "2025-11-11",
        "end": "2025-12-10"
      },
      {
        "id": "rot_335",
        "type": "work",
        "start": "2025-12-11",
        "end": "2026-01-09"
      },
      {
        "id": "rot_336",
        "type": "leave",
        "start": "2026-01-10",
        "end": "2026-02-06"
      },
      {
        "id": "rot_337",
        "type": "work",
        "start": "2026-02-07",
        "end": "2026-03-06"
      },
      {
        "id": "rot_338",
        "type": "leave",
        "start": "2026-03-07",
        "end": "2026-04-03"
      },
      {
        "id": "rot_339",
        "type": "work",
        "start": "2026-04-04",
        "end": "2026-04-24"
      },
      {
        "id": "rot_340",
        "type": "leave",
        "start": "2026-04-25",
        "end": "2026-05-15"
      },
      {
        "id": "rot_341",
        "type": "work",
        "start": "2026-05-16",
        "end": "2026-06-12"
      },
      {
        "id": "rot_342",
        "type": "leave",
        "start": "2026-06-13",
        "end": "2026-07-10"
      }
    ]
  },
  {
    "ID": "1002",
    "Name": "Hussain Mari Al-jabri",
    "Company": "PetroMasila-BLK53",
    "Department": "Security",
    "Rotations": [
      {
        "id": "rot_343",
        "type": "work",
        "start": "2025-11-13",
        "end": "2025-12-10"
      },
      {
        "id": "rot_344",
        "type": "leave",
        "start": "2025-12-11",
        "end": "2025-12-31"
      },
      {
        "id": "rot_345",
        "type": "work",
        "start": "2026-01-01",
        "end": "2026-01-31"
      },
      {
        "id": "rot_346",
        "type": "leave",
        "start": "2026-02-01",
        "end": "2026-03-03"
      },
      {
        "id": "rot_347",
        "type": "work",
        "start": "2026-03-04",
        "end": "2026-03-31"
      },
      {
        "id": "rot_348",
        "type": "leave",
        "start": "2026-04-01",
        "end": "2026-04-21"
      },
      {
        "id": "rot_349",
        "type": "work",
        "start": "2026-04-22",
        "end": "2026-05-12"
      },
      {
        "id": "rot_350",
        "type": "leave",
        "start": "2026-05-13",
        "end": "2026-06-09"
      },
      {
        "id": "rot_351",
        "type": "work",
        "start": "2026-06-10",
        "end": "2026-07-07"
      }
    ]
  },
  {
    "ID": "1003",
    "Name": "Abdulbaset Saeed  Ba' wazir",
    "Company": "PetroMasila-BLK53",
    "Department": "Security",
    "Rotations": [
      {
        "id": "rot_352",
        "type": "work",
        "start": "2025-12-18",
        "end": "2025-12-31"
      },
      {
        "id": "rot_353",
        "type": "leave",
        "start": "2026-01-01",
        "end": "2026-01-31"
      },
      {
        "id": "rot_354",
        "type": "work",
        "start": "2026-02-01",
        "end": "2026-03-03"
      },
      {
        "id": "rot_355",
        "type": "leave",
        "start": "2026-03-04",
        "end": "2026-03-31"
      },
      {
        "id": "rot_356",
        "type": "work",
        "start": "2026-04-01",
        "end": "2026-04-21"
      },
      {
        "id": "rot_357",
        "type": "leave",
        "start": "2026-04-22",
        "end": "2026-05-12"
      },
      {
        "id": "rot_358",
        "type": "work",
        "start": "2026-05-13",
        "end": "2026-06-09"
      },
      {
        "id": "rot_359",
        "type": "leave",
        "start": "2026-06-10",
        "end": "2026-07-07"
      }
    ]
  },
  {
    "ID": "1004",
    "Name": "Amjed Khaled Al-Ameri",
    "Company": "PetroMasila-BLK53",
    "Department": "Security",
    "Rotations": [
      {
        "id": "rot_360",
        "type": "work",
        "start": "2025-10-11",
        "end": "2025-11-07"
      },
      {
        "id": "rot_361",
        "type": "leave",
        "start": "2025-11-08",
        "end": "2025-12-07"
      },
      {
        "id": "rot_362",
        "type": "work",
        "start": "2025-12-08",
        "end": "2026-01-06"
      },
      {
        "id": "rot_363",
        "type": "leave",
        "start": "2026-01-07",
        "end": "2026-02-03"
      },
      {
        "id": "rot_364",
        "type": "work",
        "start": "2026-02-04",
        "end": "2026-03-03"
      },
      {
        "id": "rot_365",
        "type": "leave",
        "start": "2026-03-04",
        "end": "2026-03-31"
      },
      {
        "id": "rot_366",
        "type": "work",
        "start": "2026-04-01",
        "end": "2026-04-20"
      },
      {
        "id": "rot_367",
        "type": "leave",
        "start": "2026-04-21",
        "end": "2026-05-11"
      },
      {
        "id": "rot_368",
        "type": "work",
        "start": "2026-05-12",
        "end": "2026-06-08"
      },
      {
        "id": "rot_369",
        "type": "leave",
        "start": "2026-06-09",
        "end": "2026-07-06"
      },
      {
        "id": "rot_370",
        "type": "work",
        "start": "2026-07-07",
        "end": "2026-08-03"
      }
    ]
  },
  {
    "ID": "1005",
    "Name": "Saleh Break AL-Jabri",
    "Company": "PetroMasila-BLK53",
    "Department": "Security",
    "Rotations": [
      {
        "id": "rot_371",
        "type": "work",
        "start": "2025-11-08",
        "end": "2025-12-07"
      },
      {
        "id": "rot_372",
        "type": "leave",
        "start": "2025-12-08",
        "end": "2026-01-06"
      },
      {
        "id": "rot_373",
        "type": "work",
        "start": "2026-01-07",
        "end": "2026-02-03"
      },
      {
        "id": "rot_374",
        "type": "leave",
        "start": "2026-02-04",
        "end": "2026-03-03"
      },
      {
        "id": "rot_375",
        "type": "work",
        "start": "2026-03-04",
        "end": "2026-03-31"
      },
      {
        "id": "rot_376",
        "type": "leave",
        "start": "2026-04-01",
        "end": "2026-04-20"
      },
      {
        "id": "rot_377",
        "type": "work",
        "start": "2026-04-21",
        "end": "2026-05-11"
      },
      {
        "id": "rot_378",
        "type": "leave",
        "start": "2026-05-12",
        "end": "2026-06-08"
      },
      {
        "id": "rot_379",
        "type": "work",
        "start": "2026-06-09",
        "end": "2026-07-06"
      },
      {
        "id": "rot_380",
        "type": "leave",
        "start": "2026-07-07",
        "end": "2026-08-03"
      }
    ]
  },
  {
    "ID": "1006",
    "Name": "Mohammed Eissa Ba' Abbad",
    "Company": "PetroMasila-BLK53",
    "Department": "Security",
    "Rotations": [
      {
        "id": "rot_381",
        "type": "work",
        "start": "2025-11-16",
        "end": "2025-12-13"
      },
      {
        "id": "rot_382",
        "type": "leave",
        "start": "2025-12-14",
        "end": "2026-01-10"
      },
      {
        "id": "rot_383",
        "type": "work",
        "start": "2026-01-11",
        "end": "2026-02-07"
      },
      {
        "id": "rot_384",
        "type": "leave",
        "start": "2026-02-08",
        "end": "2026-03-06"
      },
      {
        "id": "rot_385",
        "type": "work",
        "start": "2026-03-07",
        "end": "2026-04-04"
      },
      {
        "id": "rot_386",
        "type": "leave",
        "start": "2026-04-05",
        "end": "2026-04-25"
      },
      {
        "id": "rot_387",
        "type": "work",
        "start": "2026-04-26",
        "end": "2026-05-16"
      },
      {
        "id": "rot_388",
        "type": "leave",
        "start": "2026-05-17",
        "end": "2026-06-13"
      },
      {
        "id": "rot_389",
        "type": "work",
        "start": "2026-06-14",
        "end": "2026-07-11"
      },
      {
        "id": "rot_390",
        "type": "leave",
        "start": "2026-07-12",
        "end": "2026-08-08"
      },
      {
        "id": "rot_391",
        "type": "work",
        "start": "2026-08-09",
        "end": "2026-09-05"
      },
      {
        "id": "rot_392",
        "type": "leave",
        "start": "2026-09-06",
        "end": "2026-10-03"
      }
    ]
  },
  {
    "ID": "1007",
    "Name": "Sabri Break Ba-Jari",
    "Company": "PetroMasila-BLK53",
    "Department": "Security",
    "Rotations": [
      {
        "id": "rot_393",
        "type": "work",
        "start": "2025-10-19",
        "end": "2025-11-15"
      },
      {
        "id": "rot_394",
        "type": "leave",
        "start": "2025-11-16",
        "end": "2025-12-13"
      },
      {
        "id": "rot_395",
        "type": "work",
        "start": "2025-12-14",
        "end": "2026-01-10"
      },
      {
        "id": "rot_396",
        "type": "leave",
        "start": "2026-01-11",
        "end": "2026-02-07"
      },
      {
        "id": "rot_397",
        "type": "work",
        "start": "2026-02-08",
        "end": "2026-03-06"
      },
      {
        "id": "rot_398",
        "type": "leave",
        "start": "2026-03-07",
        "end": "2026-04-04"
      },
      {
        "id": "rot_399",
        "type": "work",
        "start": "2026-04-05",
        "end": "2026-04-25"
      },
      {
        "id": "rot_400",
        "type": "leave",
        "start": "2026-04-26",
        "end": "2026-05-16"
      },
      {
        "id": "rot_401",
        "type": "work",
        "start": "2026-05-17",
        "end": "2026-06-13"
      },
      {
        "id": "rot_402",
        "type": "leave",
        "start": "2026-06-14",
        "end": "2026-07-11"
      },
      {
        "id": "rot_403",
        "type": "work",
        "start": "2026-07-12",
        "end": "2026-08-08"
      },
      {
        "id": "rot_404",
        "type": "leave",
        "start": "2026-08-09",
        "end": "2026-09-05"
      },
      {
        "id": "rot_405",
        "type": "work",
        "start": "2026-09-06",
        "end": "2026-10-03"
      }
    ]
  },
  {
    "ID": "193",
    "Name": "Abdullah Mohamed Saleh Al-Jaberi",
    "Company": "PetroMasila-BLK53",
    "Department": "Maintenance",
    "Rotations": [
      {
        "id": "rot_406",
        "type": "work",
        "start": "2025-10-13",
        "end": "2025-11-09"
      },
      {
        "id": "rot_407",
        "type": "leave",
        "start": "2025-11-10",
        "end": "2025-12-07"
      },
      {
        "id": "rot_408",
        "type": "work",
        "start": "2025-12-08",
        "end": "2026-01-05"
      },
      {
        "id": "rot_409",
        "type": "leave",
        "start": "2026-01-06",
        "end": "2026-02-03"
      },
      {
        "id": "rot_410",
        "type": "work",
        "start": "2026-02-04",
        "end": "2026-03-03"
      },
      {
        "id": "rot_411",
        "type": "leave",
        "start": "2026-03-04",
        "end": "2026-04-01"
      },
      {
        "id": "rot_412",
        "type": "work",
        "start": "2026-04-02",
        "end": "2026-04-24"
      },
      {
        "id": "rot_413",
        "type": "leave",
        "start": "2026-04-25",
        "end": "2026-05-14"
      },
      {
        "id": "rot_414",
        "type": "work",
        "start": "2026-05-15",
        "end": "2026-06-09"
      },
      {
        "id": "rot_415",
        "type": "leave",
        "start": "2026-06-10",
        "end": "2026-07-07"
      },
      {
        "id": "rot_416",
        "type": "work",
        "start": "2026-07-08",
        "end": "2026-08-04"
      },
      {
        "id": "rot_417",
        "type": "leave",
        "start": "2026-08-05",
        "end": "2026-09-01"
      },
      {
        "id": "rot_418",
        "type": "work",
        "start": "2026-09-02",
        "end": "2026-09-29"
      },
      {
        "id": "rot_419",
        "type": "leave",
        "start": "2026-09-30",
        "end": "2026-10-27"
      },
      {
        "id": "rot_420",
        "type": "work",
        "start": "2026-10-28",
        "end": "2026-11-24"
      },
      {
        "id": "rot_421",
        "type": "leave",
        "start": "2026-11-25",
        "end": "2026-12-22"
      }
    ]
  },
  {
    "ID": "165",
    "Name": "Lutfi Mohammed Ahmed Bajubair",
    "Company": "PetroMasila-BLK53",
    "Department": "Maintenance",
    "Rotations": [
      {
        "id": "rot_422",
        "type": "work",
        "start": "2025-11-10",
        "end": "2025-12-07"
      },
      {
        "id": "rot_423",
        "type": "leave",
        "start": "2025-12-08",
        "end": "2026-01-05"
      },
      {
        "id": "rot_424",
        "type": "work",
        "start": "2026-01-06",
        "end": "2026-02-03"
      },
      {
        "id": "rot_425",
        "type": "leave",
        "start": "2026-02-04",
        "end": "2026-03-03"
      },
      {
        "id": "rot_426",
        "type": "work",
        "start": "2026-03-04",
        "end": "2026-04-01"
      },
      {
        "id": "rot_427",
        "type": "leave",
        "start": "2026-04-02",
        "end": "2026-04-24"
      },
      {
        "id": "rot_428",
        "type": "work",
        "start": "2026-04-25",
        "end": "2026-05-12"
      },
      {
        "id": "rot_429",
        "type": "leave",
        "start": "2026-05-13",
        "end": "2026-06-09"
      },
      {
        "id": "rot_430",
        "type": "work",
        "start": "2026-06-10",
        "end": "2026-07-07"
      },
      {
        "id": "rot_431",
        "type": "leave",
        "start": "2026-07-08",
        "end": "2026-08-04"
      },
      {
        "id": "rot_432",
        "type": "work",
        "start": "2026-08-05",
        "end": "2026-09-01"
      },
      {
        "id": "rot_433",
        "type": "leave",
        "start": "2026-09-02",
        "end": "2026-09-29"
      },
      {
        "id": "rot_434",
        "type": "work",
        "start": "2026-09-30",
        "end": "2026-10-27"
      },
      {
        "id": "rot_435",
        "type": "leave",
        "start": "2026-10-28",
        "end": "2026-11-24"
      },
      {
        "id": "rot_436",
        "type": "work",
        "start": "2026-11-25",
        "end": "2026-12-22"
      },
      {
        "id": "rot_437",
        "type": "leave",
        "start": "2026-12-23",
        "end": "2027-01-19"
      }
    ]
  },
  {
    "ID": "185",
    "Name": "Taha Hussain Al-Zubaidi",
    "Company": "PetroMasila-BLK53",
    "Department": "Maintenance",
    "Rotations": [
      {
        "id": "rot_438",
        "type": "work",
        "start": "2025-11-24",
        "end": "2025-12-28"
      },
      {
        "id": "rot_439",
        "type": "leave",
        "start": "2025-12-29",
        "end": "2026-02-01"
      },
      {
        "id": "rot_440",
        "type": "work",
        "start": "2026-02-02",
        "end": "2026-03-01"
      },
      {
        "id": "rot_441",
        "type": "leave",
        "start": "2026-03-02",
        "end": "2026-03-29"
      },
      {
        "id": "rot_442",
        "type": "work",
        "start": "2026-03-30",
        "end": "2026-04-19"
      },
      {
        "id": "rot_443",
        "type": "leave",
        "start": "2026-04-20",
        "end": "2026-05-10"
      },
      {
        "id": "rot_444",
        "type": "work",
        "start": "2026-05-11",
        "end": "2026-06-07"
      },
      {
        "id": "rot_445",
        "type": "leave",
        "start": "2026-06-08",
        "end": "2026-07-05"
      },
      {
        "id": "rot_446",
        "type": "work",
        "start": "2026-07-06",
        "end": "2026-08-02"
      },
      {
        "id": "rot_447",
        "type": "leave",
        "start": "2026-08-03",
        "end": "2026-08-30"
      },
      {
        "id": "rot_448",
        "type": "work",
        "start": "2026-08-31",
        "end": "2026-09-27"
      },
      {
        "id": "rot_449",
        "type": "leave",
        "start": "2026-09-28",
        "end": "2026-10-25"
      },
      {
        "id": "rot_450",
        "type": "work",
        "start": "2026-10-26",
        "end": "2026-11-22"
      },
      {
        "id": "rot_451",
        "type": "leave",
        "start": "2026-11-23",
        "end": "2026-12-20"
      }
    ]
  },
  {
    "ID": "270",
    "Name": "Yasser Qassem Mansour Qasim",
    "Company": "PetroMasila-BLK53",
    "Department": "Maintenance",
    "Rotations": [
      {
        "id": "rot_452",
        "type": "work",
        "start": "2025-10-30",
        "end": "2025-11-23"
      },
      {
        "id": "rot_453",
        "type": "leave",
        "start": "2025-11-24",
        "end": "2025-12-28"
      },
      {
        "id": "rot_454",
        "type": "work",
        "start": "2025-12-29",
        "end": "2026-02-01"
      },
      {
        "id": "rot_455",
        "type": "leave",
        "start": "2026-02-02",
        "end": "2026-03-01"
      },
      {
        "id": "rot_456",
        "type": "work",
        "start": "2026-03-02",
        "end": "2026-03-29"
      },
      {
        "id": "rot_457",
        "type": "leave",
        "start": "2026-03-30",
        "end": "2026-04-19"
      },
      {
        "id": "rot_458",
        "type": "work",
        "start": "2026-04-20",
        "end": "2026-05-10"
      },
      {
        "id": "rot_459",
        "type": "leave",
        "start": "2026-05-11",
        "end": "2026-06-07"
      },
      {
        "id": "rot_460",
        "type": "work",
        "start": "2026-06-08",
        "end": "2026-07-05"
      },
      {
        "id": "rot_461",
        "type": "leave",
        "start": "2026-07-06",
        "end": "2026-08-02"
      },
      {
        "id": "rot_462",
        "type": "work",
        "start": "2026-08-03",
        "end": "2026-08-30"
      },
      {
        "id": "rot_463",
        "type": "leave",
        "start": "2026-08-31",
        "end": "2026-09-27"
      }
    ]
  },
  {
    "ID": "186",
    "Name": "Khaled Brek Saleh Al-Jaberi",
    "Company": "PetroMasila-BLK53",
    "Department": "Maintenance",
    "Rotations": [
      {
        "id": "rot_464",
        "type": "work",
        "start": "2025-10-15",
        "end": "2025-11-11"
      },
      {
        "id": "rot_465",
        "type": "leave",
        "start": "2025-11-12",
        "end": "2025-12-09"
      },
      {
        "id": "rot_466",
        "type": "work",
        "start": "2025-12-10",
        "end": "2026-01-06"
      },
      {
        "id": "rot_467",
        "type": "leave",
        "start": "2026-01-07",
        "end": "2026-02-03"
      },
      {
        "id": "rot_468",
        "type": "work",
        "start": "2026-02-04",
        "end": "2026-03-03"
      },
      {
        "id": "rot_469",
        "type": "leave",
        "start": "2026-03-04",
        "end": "2026-03-31"
      },
      {
        "id": "rot_470",
        "type": "work",
        "start": "2026-04-01",
        "end": "2026-04-21"
      },
      {
        "id": "rot_471",
        "type": "leave",
        "start": "2026-04-22",
        "end": "2026-05-12"
      },
      {
        "id": "rot_472",
        "type": "work",
        "start": "2026-05-13",
        "end": "2026-06-09"
      },
      {
        "id": "rot_473",
        "type": "leave",
        "start": "2026-06-10",
        "end": "2026-07-06"
      },
      {
        "id": "rot_474",
        "type": "work",
        "start": "2026-07-07",
        "end": "2026-08-03"
      },
      {
        "id": "rot_475",
        "type": "leave",
        "start": "2026-08-04",
        "end": "2026-08-31"
      },
      {
        "id": "rot_476",
        "type": "work",
        "start": "2026-09-01",
        "end": "2026-09-28"
      },
      {
        "id": "rot_477",
        "type": "leave",
        "start": "2026-09-29",
        "end": "2026-10-26"
      },
      {
        "id": "rot_478",
        "type": "work",
        "start": "2026-10-27",
        "end": "2026-11-23"
      },
      {
        "id": "rot_479",
        "type": "leave",
        "start": "2026-11-24",
        "end": "2026-12-22"
      },
      {
        "id": "rot_480",
        "type": "work",
        "start": "2026-12-23",
        "end": "2027-01-19"
      },
      {
        "id": "rot_481",
        "type": "leave",
        "start": "2027-01-20",
        "end": "2027-02-16"
      }
    ]
  },
  {
    "ID": "126",
    "Name": "Mohamed Saleh Aboud Al-Amri",
    "Company": "PetroMasila-BLK53",
    "Department": "Maintenance",
    "Rotations": [
      {
        "id": "rot_482",
        "type": "work",
        "start": "2025-11-12",
        "end": "2025-12-09"
      },
      {
        "id": "rot_483",
        "type": "leave",
        "start": "2025-12-10",
        "end": "2026-01-06"
      },
      {
        "id": "rot_484",
        "type": "work",
        "start": "2026-01-07",
        "end": "2026-02-03"
      },
      {
        "id": "rot_485",
        "type": "leave",
        "start": "2026-02-04",
        "end": "2026-03-03"
      },
      {
        "id": "rot_486",
        "type": "work",
        "start": "2026-03-04",
        "end": "2026-03-31"
      },
      {
        "id": "rot_487",
        "type": "leave",
        "start": "2026-04-01",
        "end": "2026-04-21"
      },
      {
        "id": "rot_488",
        "type": "work",
        "start": "2026-04-22",
        "end": "2026-05-12"
      },
      {
        "id": "rot_489",
        "type": "leave",
        "start": "2026-05-13",
        "end": "2026-06-09"
      },
      {
        "id": "rot_490",
        "type": "work",
        "start": "2026-06-10",
        "end": "2026-07-06"
      },
      {
        "id": "rot_491",
        "type": "leave",
        "start": "2026-07-07",
        "end": "2026-08-03"
      },
      {
        "id": "rot_492",
        "type": "work",
        "start": "2026-08-04",
        "end": "2026-08-31"
      },
      {
        "id": "rot_493",
        "type": "leave",
        "start": "2026-09-01",
        "end": "2026-09-28"
      },
      {
        "id": "rot_494",
        "type": "work",
        "start": "2026-09-29",
        "end": "2026-10-26"
      },
      {
        "id": "rot_495",
        "type": "leave",
        "start": "2026-10-27",
        "end": "2026-11-23"
      }
    ]
  },
  {
    "ID": "192",
    "Name": "Salem Omr Salem Bawazeer",
    "Company": "PetroMasila-BLK53",
    "Department": "Maintenance",
    "Rotations": [
      {
        "id": "rot_496",
        "type": "work",
        "start": "2025-10-11",
        "end": "2025-11-06"
      },
      {
        "id": "rot_504",
        "type": "leave",
        "start": "2025-11-07",
        "end": "2025-12-05"
      },
      {
        "id": "rot_497",
        "type": "work",
        "start": "2025-12-06",
        "end": "2026-01-05"
      },
      {
        "id": "rot_505",
        "type": "leave",
        "start": "2026-01-06",
        "end": "2026-02-03"
      },
      {
        "id": "rot_498",
        "type": "work",
        "start": "2026-02-04",
        "end": "2026-03-04"
      },
      {
        "id": "rot_506",
        "type": "leave",
        "start": "2026-03-05",
        "end": "2026-03-31"
      },
      {
        "id": "rot_499",
        "type": "work",
        "start": "2026-04-01",
        "end": "2026-04-22"
      },
      {
        "id": "rot_507",
        "type": "leave",
        "start": "2026-04-23",
        "end": "2026-05-12"
      },
      {
        "id": "rot_500",
        "type": "work",
        "start": "2026-05-13",
        "end": "2026-06-10"
      },
      {
        "id": "rot_508",
        "type": "leave",
        "start": "2026-06-11",
        "end": "2026-07-07"
      },
      {
        "id": "rot_501",
        "type": "work",
        "start": "2026-07-08",
        "end": "2026-08-05"
      },
      {
        "id": "rot_509",
        "type": "leave",
        "start": "2026-08-06",
        "end": "2026-09-01"
      },
      {
        "id": "rot_502",
        "type": "work",
        "start": "2026-09-02",
        "end": "2026-09-30"
      },
      {
        "id": "rot_510",
        "type": "leave",
        "start": "2026-10-01",
        "end": "2026-10-27"
      },
      {
        "id": "rot_503",
        "type": "work",
        "start": "2026-10-28",
        "end": "2026-11-25"
      }
    ]
  },
  {
    "ID": "194",
    "Name": "Saeed Salmin Ahmed Al-Ameri",
    "Company": "PetroMasila-BLK53",
    "Department": "Maintenance",
    "Rotations": [
      {
        "id": "rot_511",
        "type": "work",
        "start": "2025-11-06",
        "end": "2025-12-05"
      },
      {
        "id": "rot_512",
        "type": "leave",
        "start": "2025-12-06",
        "end": "2026-01-04"
      },
      {
        "id": "rot_513",
        "type": "work",
        "start": "2026-01-05",
        "end": "2026-02-03"
      },
      {
        "id": "rot_514",
        "type": "leave",
        "start": "2026-02-04",
        "end": "2026-03-03"
      },
      {
        "id": "rot_515",
        "type": "work",
        "start": "2026-03-04",
        "end": "2026-03-31"
      },
      {
        "id": "rot_516",
        "type": "leave",
        "start": "2026-04-01",
        "end": "2026-04-21"
      },
      {
        "id": "rot_517",
        "type": "work",
        "start": "2026-04-22",
        "end": "2026-05-12"
      },
      {
        "id": "rot_518",
        "type": "leave",
        "start": "2026-05-13",
        "end": "2026-06-09"
      },
      {
        "id": "rot_519",
        "type": "work",
        "start": "2026-06-10",
        "end": "2026-07-07"
      },
      {
        "id": "rot_520",
        "type": "leave",
        "start": "2026-07-08",
        "end": "2026-08-04"
      },
      {
        "id": "rot_521",
        "type": "work",
        "start": "2026-08-05",
        "end": "2026-09-01"
      },
      {
        "id": "rot_522",
        "type": "leave",
        "start": "2026-09-02",
        "end": "2026-09-29"
      },
      {
        "id": "rot_523",
        "type": "work",
        "start": "2026-09-30",
        "end": "2026-10-27"
      },
      {
        "id": "rot_524",
        "type": "leave",
        "start": "2026-10-28",
        "end": "2026-11-24"
      }
    ]
  },
  {
    "ID": "224",
    "Name": "Aboud Karamah Shaikh Al-Zubidi",
    "Company": "PetroMasila - BLK53",
    "Department": "Maintenance",
    "Rotations": [
      {
        "id": "rot_525",
        "type": "work",
        "start": "2025-11-09",
        "end": "2025-12-06"
      },
      {
        "id": "rot_526",
        "type": "leave",
        "start": "2025-12-07",
        "end": "2026-01-05"
      },
      {
        "id": "rot_527",
        "type": "work",
        "start": "2026-01-06",
        "end": "2026-02-04"
      },
      {
        "id": "rot_528",
        "type": "leave",
        "start": "2026-02-05",
        "end": "2026-03-04"
      },
      {
        "id": "rot_529",
        "type": "work",
        "start": "2026-03-05",
        "end": "2026-04-01"
      },
      {
        "id": "rot_530",
        "type": "leave",
        "start": "2026-04-02",
        "end": "2026-04-22"
      },
      {
        "id": "rot_531",
        "type": "work",
        "start": "2026-04-23",
        "end": "2026-05-13"
      },
      {
        "id": "rot_532",
        "type": "leave",
        "start": "2026-05-14",
        "end": "2026-06-10"
      },
      {
        "id": "rot_533",
        "type": "work",
        "start": "2026-06-11",
        "end": "2026-07-08"
      },
      {
        "id": "rot_534",
        "type": "leave",
        "start": "2026-07-09",
        "end": "2026-08-05"
      },
      {
        "id": "rot_535",
        "type": "work",
        "start": "2026-08-06",
        "end": "2026-09-02"
      },
      {
        "id": "rot_536",
        "type": "leave",
        "start": "2026-09-03",
        "end": "2026-09-30"
      },
      {
        "id": "rot_537",
        "type": "work",
        "start": "2026-10-01",
        "end": "2026-10-28"
      },
      {
        "id": "rot_538",
        "type": "leave",
        "start": "2026-10-29",
        "end": "2026-11-25"
      },
      {
        "id": "rot_539",
        "type": "work",
        "start": "2026-11-26",
        "end": "2026-12-23"
      }
    ]
  },
  {
    "ID": "118",
    "Name": "Hussein Awadh Brek Humaid",
    "Company": "PetroMasila-BLK53",
    "Department": "Maintenance",
    "Rotations": [
      {
        "id": "rot_540",
        "type": "work",
        "start": "2025-10-12",
        "end": "2025-11-08"
      },
      {
        "id": "rot_541",
        "type": "leave",
        "start": "2025-11-09",
        "end": "2025-12-06"
      },
      {
        "id": "rot_542",
        "type": "work",
        "start": "2025-12-07",
        "end": "2026-01-05"
      },
      {
        "id": "rot_543",
        "type": "leave",
        "start": "2026-01-06",
        "end": "2026-02-04"
      },
      {
        "id": "rot_544",
        "type": "work",
        "start": "2026-02-05",
        "end": "2026-03-04"
      },
      {
        "id": "rot_545",
        "type": "leave",
        "start": "2026-03-05",
        "end": "2026-04-01"
      },
      {
        "id": "rot_546",
        "type": "work",
        "start": "2026-04-02",
        "end": "2026-04-22"
      },
      {
        "id": "rot_547",
        "type": "leave",
        "start": "2026-04-23",
        "end": "2026-05-13"
      },
      {
        "id": "rot_548",
        "type": "work",
        "start": "2026-05-14",
        "end": "2026-06-10"
      },
      {
        "id": "rot_549",
        "type": "leave",
        "start": "2026-06-11",
        "end": "2026-07-08"
      },
      {
        "id": "rot_550",
        "type": "work",
        "start": "2026-07-09",
        "end": "2026-08-05"
      },
      {
        "id": "rot_551",
        "type": "leave",
        "start": "2026-08-06",
        "end": "2026-09-02"
      },
      {
        "id": "rot_552",
        "type": "work",
        "start": "2026-09-03",
        "end": "2026-09-30"
      },
      {
        "id": "rot_553",
        "type": "leave",
        "start": "2026-10-01",
        "end": "2026-10-28"
      },
      {
        "id": "rot_554",
        "type": "work",
        "start": "2026-10-29",
        "end": "2026-11-25"
      },
      {
        "id": "rot_555",
        "type": "leave",
        "start": "2026-11-26",
        "end": "2026-12-23"
      }
    ]
  },
  {
    "ID": "132",
    "Name": "Mansour Salem Mohammed Al-Akbari",
    "Company": "PetroMasila - BLK53",
    "Department": "Maintenance",
    "Rotations": [
  {
    "id": "rot_1785870124373_0",
    "type": "work",
    "start": "2025-11-08",
    "end": "2025-12-06"
  },
  {
    "id": "rot_1785870124373_1",
    "type": "leave",
    "start": "2025-12-07",
    "end": "2026-01-05"
  },
  {
    "id": "rot_1785870124373_2",
    "type": "work",
    "start": "2026-01-05",
    "end": "2026-02-04"
  },
  {
    "id": "rot_1785870124373_3",
    "type": "leave",
    "start": "2026-02-05",
    "end": "2026-03-04"
  },
  {
    "id": "rot_1785870124373_4",
    "type": "work",
    "start": "2026-03-04",
    "end": "2026-04-01"
  },
  {
    "id": "rot_1785870124373_5",
    "type": "leave",
    "start": "2026-04-02",
    "end": "2026-04-22"
  },
  {
    "id": "rot_1785870124373_6",
    "type": "work",
    "start": "2026-04-22",
    "end": "2026-05-13"
  },
  {
    "id": "rot_1785870124373_7",
    "type": "leave",
    "start": "2026-05-14",
    "end": "2026-06-10"
  },
  {
    "id": "rot_1785870124373_8",
    "type": "work",
    "start": "2026-06-10",
    "end": "2026-07-08"
  },
  {
    "id": "rot_1785870124373_9",
    "type": "leave",
    "start": "2026-07-09",
    "end": "2026-08-05"
  },
  {
    "id": "rot_1785870124373_10",
    "type": "work",
    "start": "2026-08-05",
    "end": "2026-09-02"
  },
  {
    "id": "rot_1785870124373_11",
    "type": "leave",
    "start": "2026-09-03",
    "end": "2026-09-30"
  },
  {
    "id": "rot_1785870124373_12",
    "type": "work",
    "start": "2026-09-30",
    "end": "2026-10-28"
  },
  {
    "id": "rot_1785870124373_13",
    "type": "leave",
    "start": "2026-10-29",
    "end": "2026-11-25"
  },
  {
    "id": "rot_1785870124373_14",
    "type": "work",
    "start": "2026-11-25",
    "end": "2026-12-23"
  },
  {
    "id": "rot_1785870124373_15",
    "type": "leave",
    "start": "2026-12-24",
    "end": "2027-01-20"
  },
  {
    "id": "rot_1785870124373_16",
    "type": "work",
    "start": "2027-01-20",
    "end": "2027-02-18"
  }
]
  },
  {
    "ID": "191",
    "Name": "Naser Awadh Ali Al-Hamoodi",
    "Company": "PetroMasila-BLK53",
    "Department": "Maintenance",
    "Rotations": [
      {
        "id": "rot_573",
        "type": "work",
        "start": "2025-10-11",
        "end": "2025-11-08"
      },
      {
        "id": "rot_574",
        "type": "leave",
        "start": "2025-11-09",
        "end": "2025-12-06"
      },
      {
        "id": "rot_575",
        "type": "work",
        "start": "2025-12-07",
        "end": "2026-01-05"
      },
      {
        "id": "rot_576",
        "type": "leave",
        "start": "2026-01-06",
        "end": "2026-02-04"
      },
      {
        "id": "rot_577",
        "type": "work",
        "start": "2026-02-05",
        "end": "2026-03-04"
      },
      {
        "id": "rot_578",
        "type": "leave",
        "start": "2026-03-05",
        "end": "2026-04-01"
      },
      {
        "id": "rot_579",
        "type": "work",
        "start": "2026-04-02",
        "end": "2026-04-22"
      },
      {
        "id": "rot_580",
        "type": "leave",
        "start": "2026-04-23",
        "end": "2026-05-13"
      },
      {
        "id": "rot_581",
        "type": "work",
        "start": "2026-05-14",
        "end": "2026-06-10"
      },
      {
        "id": "rot_582",
        "type": "leave",
        "start": "2026-06-11",
        "end": "2026-07-08"
      },
      {
        "id": "rot_583",
        "type": "work",
        "start": "2026-07-09",
        "end": "2026-08-05"
      },
      {
        "id": "rot_584",
        "type": "leave",
        "start": "2026-08-06",
        "end": "2026-09-02"
      },
      {
        "id": "rot_585",
        "type": "work",
        "start": "2026-09-03",
        "end": "2026-09-30"
      },
      {
        "id": "rot_586",
        "type": "leave",
        "start": "2026-10-01",
        "end": "2026-10-28"
      },
      {
        "id": "rot_587",
        "type": "work",
        "start": "2026-10-29",
        "end": "2026-11-25"
      },
      {
        "id": "rot_588",
        "type": "leave",
        "start": "2026-11-26",
        "end": "2026-12-23"
      }
    ]
  },
  {
    "ID": "1008",
    "Name": "Wajde Ayoub Markeb",
    "Company": "PetroMasila-BLK53",
    "Department": "Maintenance",
    "Rotations": [
      {
        "id": "rot_589",
        "type": "work",
        "start": "2025-10-11",
        "end": "2025-11-08"
      },
      {
        "id": "rot_590",
        "type": "leave",
        "start": "2025-11-09",
        "end": "2025-12-06"
      },
      {
        "id": "rot_591",
        "type": "work",
        "start": "2025-12-07",
        "end": "2026-01-03"
      },
      {
        "id": "rot_592",
        "type": "leave",
        "start": "2026-01-04",
        "end": "2026-01-31"
      },
      {
        "id": "rot_593",
        "type": "work",
        "start": "2026-02-01",
        "end": "2026-02-28"
      },
      {
        "id": "rot_594",
        "type": "leave",
        "start": "2026-03-01",
        "end": "2026-03-28"
      },
      {
        "id": "rot_595",
        "type": "work",
        "start": "2026-03-29",
        "end": "2026-04-25"
      },
      {
        "id": "rot_596",
        "type": "leave",
        "start": "2026-04-26",
        "end": "2026-05-23"
      },
      {
        "id": "rot_597",
        "type": "work",
        "start": "2026-05-24",
        "end": "2026-06-20"
      },
      {
        "id": "rot_598",
        "type": "leave",
        "start": "2026-06-21",
        "end": "2026-07-18"
      },
      {
        "id": "rot_599",
        "type": "work",
        "start": "2026-07-19",
        "end": "2026-08-15"
      },
      {
        "id": "rot_600",
        "type": "leave",
        "start": "2026-08-16",
        "end": "2026-09-12"
      },
      {
        "id": "rot_601",
        "type": "work",
        "start": "2026-09-13",
        "end": "2026-10-10"
      },
      {
        "id": "rot_602",
        "type": "leave",
        "start": "2026-10-11",
        "end": "2026-11-07"
      },
      {
        "id": "rot_603",
        "type": "work",
        "start": "2026-11-08",
        "end": "2026-12-05"
      }
    ]
  },
  {
    "ID": "158",
    "Name": "Abdullah Alkhader Mohammed Saleh",
    "Company": "PetroMasila-BLK53",
    "Department": "Maintenance",
    "Rotations": [
      {
        "id": "rot_604",
        "type": "work",
        "start": "2025-10-06",
        "end": "2025-11-02"
      },
      {
        "id": "rot_605",
        "type": "leave",
        "start": "2025-11-03",
        "end": "2025-12-06"
      },
      {
        "id": "rot_606",
        "type": "work",
        "start": "2025-12-07",
        "end": "2026-01-09"
      },
      {
        "id": "rot_607",
        "type": "leave",
        "start": "2026-01-10",
        "end": "2026-02-14"
      },
      {
        "id": "rot_608",
        "type": "work",
        "start": "2026-02-15",
        "end": "2026-03-06"
      },
      {
        "id": "rot_609",
        "type": "leave",
        "start": "2026-03-07",
        "end": "2026-03-27"
      },
      {
        "id": "rot_610",
        "type": "work",
        "start": "2026-03-28",
        "end": "2026-04-17"
      },
      {
        "id": "rot_611",
        "type": "leave",
        "start": "2026-04-18",
        "end": "2026-05-15"
      },
      {
        "id": "rot_612",
        "type": "work",
        "start": "2026-05-16",
        "end": "2026-06-12"
      },
      {
        "id": "rot_613",
        "type": "leave",
        "start": "2026-06-13",
        "end": "2026-07-03"
      },
      {
        "id": "rot_614",
        "type": "work",
        "start": "2026-07-04",
        "end": "2026-08-07"
      },
      {
        "id": "rot_615",
        "type": "leave",
        "start": "2026-08-08",
        "end": "2026-09-04"
      },
      {
        "id": "rot_616",
        "type": "work",
        "start": "2026-09-05",
        "end": "2026-10-02"
      },
      {
        "id": "rot_617",
        "type": "leave",
        "start": "2026-10-03",
        "end": "2026-10-30"
      },
      {
        "id": "rot_618",
        "type": "work",
        "start": "2026-10-31",
        "end": "2026-11-27"
      },
      {
        "id": "rot_619",
        "type": "leave",
        "start": "2026-11-28",
        "end": "2026-12-25"
      }
    ]
  },
  {
    "ID": "232",
    "Name": "Medhat Hassan Ali Hassan",
    "Company": "PetroMasila-BLK53",
    "Department": "Maintenance",
    "Rotations": [
      {
        "id": "rot_620",
        "type": "work",
        "start": "2025-11-03",
        "end": "2025-12-06"
      },
      {
        "id": "rot_621",
        "type": "leave",
        "start": "2025-12-07",
        "end": "2026-01-09"
      },
      {
        "id": "rot_622",
        "type": "work",
        "start": "2026-01-10",
        "end": "2026-02-14"
      },
      {
        "id": "rot_623",
        "type": "leave",
        "start": "2026-02-15",
        "end": "2026-03-06"
      },
      {
        "id": "rot_624",
        "type": "work",
        "start": "2026-03-07",
        "end": "2026-03-27"
      },
      {
        "id": "rot_625",
        "type": "leave",
        "start": "2026-03-28",
        "end": "2026-04-17"
      },
      {
        "id": "rot_626",
        "type": "work",
        "start": "2026-04-18",
        "end": "2026-05-15"
      },
      {
        "id": "rot_627",
        "type": "leave",
        "start": "2026-05-16",
        "end": "2026-06-12"
      },
      {
        "id": "rot_628",
        "type": "work",
        "start": "2026-06-13",
        "end": "2026-07-03"
      },
      {
        "id": "rot_629",
        "type": "leave",
        "start": "2026-07-04",
        "end": "2026-08-07"
      },
      {
        "id": "rot_630",
        "type": "work",
        "start": "2026-08-08",
        "end": "2026-09-04"
      },
      {
        "id": "rot_631",
        "type": "leave",
        "start": "2026-09-05",
        "end": "2026-10-02"
      },
      {
        "id": "rot_632",
        "type": "work",
        "start": "2026-10-03",
        "end": "2026-10-30"
      },
      {
        "id": "rot_633",
        "type": "leave",
        "start": "2026-10-31",
        "end": "2026-11-27"
      },
      {
        "id": "rot_634",
        "type": "work",
        "start": "2026-11-28",
        "end": "2026-12-25"
      }
    ]
  },
  {
    "ID": "229",
    "Name": "Adnan Futaini Awadh Mohammed",
    "Company": "PetroMasila-BLK53",
    "Department": "Maintenance",
    "Rotations": [
      {
        "id": "rot_635",
        "type": "work",
        "start": "2025-10-15",
        "end": "2025-11-11"
      },
      {
        "id": "rot_636",
        "type": "leave",
        "start": "2025-11-12",
        "end": "2025-12-10"
      },
      {
        "id": "rot_637",
        "type": "work",
        "start": "2025-12-11",
        "end": "2026-01-09"
      },
      {
        "id": "rot_638",
        "type": "leave",
        "start": "2026-01-10",
        "end": "2026-02-14"
      },
      {
        "id": "rot_639",
        "type": "work",
        "start": "2026-02-15",
        "end": "2026-03-06"
      },
      {
        "id": "rot_640",
        "type": "leave",
        "start": "2026-03-07",
        "end": "2026-04-01"
      },
      {
        "id": "rot_641",
        "type": "work",
        "start": "2026-04-02",
        "end": "2026-04-29"
      },
      {
        "id": "rot_642",
        "type": "leave",
        "start": "2026-04-30",
        "end": "2026-05-27"
      },
      {
        "id": "rot_643",
        "type": "work",
        "start": "2026-05-28",
        "end": "2026-06-23"
      },
      {
        "id": "rot_644",
        "type": "leave",
        "start": "2026-06-24",
        "end": "2026-07-21"
      }
    ]
  },
  {
    "ID": "123",
    "Name": "Azhoon Saeed Zain AlZubaidi",
    "Company": "PetroMasila-BLK53",
    "Department": "Managment",
    "Rotations": [
      {
        "id": "rot_645",
        "type": "work",
        "start": "2025-11-26",
        "end": "2025-12-26"
      },
      {
        "id": "rot_646",
        "type": "leave",
        "start": "2025-12-27",
        "end": "2026-01-23"
      },
      {
        "id": "rot_647",
        "type": "work",
        "start": "2026-01-24",
        "end": "2026-02-23"
      }
    ]
  },
  {
    "ID": "205",
    "Name": "Abdullah Salem Abdullah Bukair",
    "Company": "PetroMasila-BLK53",
    "Department": "Operations",
    "Rotations": [
      {
        "id": "rot_648",
        "type": "work",
        "start": "2025-11-12",
        "end": "2025-12-09"
      },
      {
        "id": "rot_649",
        "type": "leave",
        "start": "2025-12-10",
        "end": "2026-01-06"
      },
      {
        "id": "rot_650",
        "type": "work",
        "start": "2026-01-07",
        "end": "2026-02-03"
      },
      {
        "id": "rot_651",
        "type": "leave",
        "start": "2026-02-04",
        "end": "2026-03-03"
      },
      {
        "id": "rot_652",
        "type": "work",
        "start": "2026-03-04",
        "end": "2026-03-31"
      },
      {
        "id": "rot_653",
        "type": "leave",
        "start": "2026-04-01",
        "end": "2026-04-28"
      },
      {
        "id": "rot_654",
        "type": "work",
        "start": "2026-04-29",
        "end": "2026-05-23"
      },
      {
        "id": "rot_655",
        "type": "leave",
        "start": "2026-05-24",
        "end": "2026-06-19"
      },
      {
        "id": "rot_656",
        "type": "work",
        "start": "2026-06-20",
        "end": "2026-07-18"
      },
      {
        "id": "rot_657",
        "type": "leave",
        "start": "2026-07-19",
        "end": "2026-08-15"
      },
      {
        "id": "rot_658",
        "type": "work",
        "start": "2026-08-16",
        "end": "2026-09-12"
      },
      {
        "id": "rot_659",
        "type": "leave",
        "start": "2026-09-13",
        "end": "2026-10-10"
      },
      {
        "id": "rot_660",
        "type": "work",
        "start": "2026-10-11",
        "end": "2026-11-07"
      },
      {
        "id": "rot_661",
        "type": "leave",
        "start": "2026-11-08",
        "end": "2026-12-05"
      },
      {
        "id": "rot_662",
        "type": "work",
        "start": "2026-12-06",
        "end": "2027-01-02"
      },
      {
        "id": "rot_663",
        "type": "leave",
        "start": "2027-01-03",
        "end": "2027-01-30"
      },
      {
        "id": "rot_664",
        "type": "work",
        "start": "2027-01-31",
        "end": "2027-02-27"
      }
    ]
  },
  {
    "ID": "204",
    "Name": "Abdullah Ahmed Omer Barasheed",
    "Company": "PetroMasila-BLK53",
    "Department": "Operations",
    "Rotations": [
      {
        "id": "rot_665",
        "type": "work",
        "start": "2025-10-12",
        "end": "2025-11-11"
      },
      {
        "id": "rot_666",
        "type": "leave",
        "start": "2025-11-12",
        "end": "2025-12-09"
      },
      {
        "id": "rot_667",
        "type": "work",
        "start": "2025-12-10",
        "end": "2026-01-06"
      },
      {
        "id": "rot_668",
        "type": "leave",
        "start": "2026-01-07",
        "end": "2026-02-03"
      },
      {
        "id": "rot_669",
        "type": "work",
        "start": "2026-02-04",
        "end": "2026-03-03"
      },
      {
        "id": "rot_670",
        "type": "leave",
        "start": "2026-03-04",
        "end": "2026-03-31"
      },
      {
        "id": "rot_671",
        "type": "work",
        "start": "2026-04-01",
        "end": "2026-04-28"
      },
      {
        "id": "rot_672",
        "type": "leave",
        "start": "2026-04-29",
        "end": "2026-05-23"
      },
      {
        "id": "rot_673",
        "type": "work",
        "start": "2026-05-24",
        "end": "2026-06-19"
      },
      {
        "id": "rot_674",
        "type": "leave",
        "start": "2026-06-20",
        "end": "2026-07-18"
      },
      {
        "id": "rot_675",
        "type": "work",
        "start": "2026-07-19",
        "end": "2026-08-15"
      },
      {
        "id": "rot_676",
        "type": "leave",
        "start": "2026-08-16",
        "end": "2026-09-12"
      },
      {
        "id": "rot_677",
        "type": "work",
        "start": "2026-09-13",
        "end": "2026-10-10"
      },
      {
        "id": "rot_678",
        "type": "leave",
        "start": "2026-10-11",
        "end": "2026-11-07"
      },
      {
        "id": "rot_679",
        "type": "work",
        "start": "2026-11-08",
        "end": "2026-12-05"
      },
      {
        "id": "rot_680",
        "type": "leave",
        "start": "2026-12-06",
        "end": "2027-01-02"
      },
      {
        "id": "rot_681",
        "type": "work",
        "start": "2027-01-03",
        "end": "2027-01-30"
      }
    ]
  },
  {
    "ID": "162",
    "Name": "Fuad Awad Al-Seyari",
    "Company": "PetroMasila-BLK53",
    "Department": "Operations",
    "Rotations": [
      {
        "id": "rot_682",
        "type": "work",
        "start": "2025-11-02",
        "end": "2025-11-22"
      },
      {
        "id": "rot_683",
        "type": "leave",
        "start": "2025-11-23",
        "end": "2025-12-13"
      },
      {
        "id": "rot_684",
        "type": "work",
        "start": "2025-12-14",
        "end": "2026-01-10"
      },
      {
        "id": "rot_685",
        "type": "leave",
        "start": "2026-01-11",
        "end": "2026-02-07"
      },
      {
        "id": "rot_686",
        "type": "work",
        "start": "2026-02-08",
        "end": "2026-03-04"
      },
      {
        "id": "rot_687",
        "type": "leave",
        "start": "2026-03-05",
        "end": "2026-03-29"
      },
      {
        "id": "rot_688",
        "type": "work",
        "start": "2026-03-30",
        "end": "2026-04-22"
      },
      {
        "id": "rot_689",
        "type": "leave",
        "start": "2026-04-23",
        "end": "2026-05-16"
      },
      {
        "id": "rot_690",
        "type": "work",
        "start": "2026-05-17",
        "end": "2026-06-13"
      },
      {
        "id": "rot_691",
        "type": "leave",
        "start": "2026-06-14",
        "end": "2026-07-11"
      },
      {
        "id": "rot_692",
        "type": "work",
        "start": "2026-07-12",
        "end": "2026-08-08"
      },
      {
        "id": "rot_693",
        "type": "leave",
        "start": "2026-08-09",
        "end": "2026-09-05"
      },
      {
        "id": "rot_694",
        "type": "work",
        "start": "2026-09-06",
        "end": "2026-10-03"
      },
      {
        "id": "rot_695",
        "type": "leave",
        "start": "2026-10-04",
        "end": "2026-10-31"
      },
      {
        "id": "rot_696",
        "type": "work",
        "start": "2026-11-01",
        "end": "2026-11-28"
      },
      {
        "id": "rot_697",
        "type": "leave",
        "start": "2026-11-29",
        "end": "2026-12-26"
      },
      {
        "id": "rot_698",
        "type": "work",
        "start": "2026-12-27",
        "end": "2027-01-23"
      }
    ]
  },
  {
    "ID": "169",
    "Name": "Nafa Brek Abdullah Al-Jaberi",
    "Company": "PetroMasila-BLK53",
    "Department": "Operations",
    "Rotations": [
      {
        "id": "rot_699",
        "type": "work",
        "start": "2025-11-23",
        "end": "2025-12-13"
      },
      {
        "id": "rot_700",
        "type": "leave",
        "start": "2025-12-14",
        "end": "2026-01-10"
      },
      {
        "id": "rot_701",
        "type": "work",
        "start": "2026-01-11",
        "end": "2026-02-07"
      },
      {
        "id": "rot_702",
        "type": "leave",
        "start": "2026-02-08",
        "end": "2026-03-04"
      },
      {
        "id": "rot_703",
        "type": "work",
        "start": "2026-03-05",
        "end": "2026-03-29"
      },
      {
        "id": "rot_704",
        "type": "leave",
        "start": "2026-03-30",
        "end": "2026-04-22"
      },
      {
        "id": "rot_705",
        "type": "work",
        "start": "2026-04-23",
        "end": "2026-05-16"
      },
      {
        "id": "rot_706",
        "type": "leave",
        "start": "2026-05-17",
        "end": "2026-06-13"
      },
      {
        "id": "rot_707",
        "type": "work",
        "start": "2026-06-14",
        "end": "2026-07-11"
      },
      {
        "id": "rot_708",
        "type": "leave",
        "start": "2026-07-12",
        "end": "2026-08-08"
      },
      {
        "id": "rot_709",
        "type": "work",
        "start": "2026-08-09",
        "end": "2026-09-05"
      },
      {
        "id": "rot_710",
        "type": "leave",
        "start": "2026-09-06",
        "end": "2026-10-03"
      },
      {
        "id": "rot_711",
        "type": "work",
        "start": "2026-10-04",
        "end": "2026-10-31"
      },
      {
        "id": "rot_712",
        "type": "leave",
        "start": "2026-11-01",
        "end": "2026-11-28"
      },
      {
        "id": "rot_713",
        "type": "work",
        "start": "2026-11-29",
        "end": "2026-12-26"
      }
    ]
  },
  {
    "ID": "266",
    "Name": "Hisham Ali Baraja",
    "Company": "PetroMasila-BLK53",
    "Department": "Operations",
    "Rotations": [
      {
        "id": "rot_714",
        "type": "work",
        "start": "2025-11-16",
        "end": "2025-12-13"
      },
      {
        "id": "rot_715",
        "type": "leave",
        "start": "2025-12-14",
        "end": "2026-01-10"
      },
      {
        "id": "rot_716",
        "type": "work",
        "start": "2026-01-11",
        "end": "2026-02-07"
      },
      {
        "id": "rot_717",
        "type": "leave",
        "start": "2026-02-08",
        "end": "2026-03-03"
      },
      {
        "id": "rot_718",
        "type": "work",
        "start": "2026-03-04",
        "end": "2026-03-31"
      },
      {
        "id": "rot_719",
        "type": "leave",
        "start": "2026-04-01",
        "end": "2026-04-28"
      },
      {
        "id": "rot_720",
        "type": "work",
        "start": "2026-04-29",
        "end": "2026-05-22"
      },
      {
        "id": "rot_721",
        "type": "leave",
        "start": "2026-05-23",
        "end": "2026-06-19"
      },
      {
        "id": "rot_722",
        "type": "work",
        "start": "2026-06-20",
        "end": "2026-07-18"
      },
      {
        "id": "rot_723",
        "type": "leave",
        "start": "2026-07-19",
        "end": "2026-08-15"
      },
      {
        "id": "rot_724",
        "type": "work",
        "start": "2026-08-16",
        "end": "2026-09-12"
      },
      {
        "id": "rot_725",
        "type": "leave",
        "start": "2026-09-13",
        "end": "2026-10-10"
      },
      {
        "id": "rot_726",
        "type": "work",
        "start": "2026-10-11",
        "end": "2026-11-07"
      },
      {
        "id": "rot_727",
        "type": "leave",
        "start": "2026-11-08",
        "end": "2026-12-05"
      },
      {
        "id": "rot_728",
        "type": "work",
        "start": "2026-12-06",
        "end": "2027-01-02"
      }
    ]
  },
  {
    "ID": "152",
    "Name": "Wadhah Abdullah Faraj Bazarqan",
    "Company": "PetroMasila-BLK53",
    "Department": "Operations",
    "Rotations": [
      {
        "id": "rot_729",
        "type": "work",
        "start": "2025-10-29",
        "end": "2025-11-15"
      },
      {
        "id": "rot_730",
        "type": "leave",
        "start": "2025-11-16",
        "end": "2025-12-13"
      },
      {
        "id": "rot_731",
        "type": "work",
        "start": "2025-12-14",
        "end": "2026-01-10"
      },
      {
        "id": "rot_732",
        "type": "leave",
        "start": "2026-01-11",
        "end": "2026-02-07"
      },
      {
        "id": "rot_733",
        "type": "work",
        "start": "2026-02-08",
        "end": "2026-03-03"
      },
      {
        "id": "rot_734",
        "type": "leave",
        "start": "2026-03-04",
        "end": "2026-03-31"
      },
      {
        "id": "rot_735",
        "type": "work",
        "start": "2026-04-01",
        "end": "2026-04-28"
      },
      {
        "id": "rot_736",
        "type": "leave",
        "start": "2026-04-29",
        "end": "2026-05-22"
      },
      {
        "id": "rot_737",
        "type": "work",
        "start": "2026-05-23",
        "end": "2026-06-08"
      },
      {
        "id": "rot_738",
        "type": "leave",
        "start": "2026-06-09",
        "end": "2026-07-18"
      },
      {
        "id": "rot_739",
        "type": "work",
        "start": "2026-07-19",
        "end": "2026-08-15"
      },
      {
        "id": "rot_740",
        "type": "leave",
        "start": "2026-08-16",
        "end": "2026-09-12"
      },
      {
        "id": "rot_741",
        "type": "work",
        "start": "2026-09-13",
        "end": "2026-10-10"
      },
      {
        "id": "rot_742",
        "type": "leave",
        "start": "2026-10-11",
        "end": "2026-11-07"
      },
      {
        "id": "rot_743",
        "type": "work",
        "start": "2026-11-08",
        "end": "2026-12-05"
      },
      {
        "id": "rot_744",
        "type": "leave",
        "start": "2026-12-06",
        "end": "2027-01-02"
      },
      {
        "id": "rot_745",
        "type": "work",
        "start": "2027-01-03",
        "end": "2027-01-30"
      }
    ]
  },
  {
    "ID": "225",
    "Name": "Raqi A'aidha Abdullah Al-Amri",
    "Company": "PetroMasila-BLK53",
    "Department": "Operations",
    "Rotations": [
      {
        "id": "rot_746",
        "type": "work",
        "start": "2025-11-20",
        "end": "2025-12-10"
      },
      {
        "id": "rot_747",
        "type": "leave",
        "start": "2025-12-11",
        "end": "2025-12-31"
      },
      {
        "id": "rot_748",
        "type": "work",
        "start": "2026-01-01",
        "end": "2026-01-24"
      },
      {
        "id": "rot_749",
        "type": "leave",
        "start": "2026-01-25",
        "end": "2026-02-15"
      },
      {
        "id": "rot_750",
        "type": "work",
        "start": "2026-02-16",
        "end": "2026-03-13"
      },
      {
        "id": "rot_751",
        "type": "leave",
        "start": "2026-03-14",
        "end": "2026-04-17"
      },
      {
        "id": "rot_752",
        "type": "work",
        "start": "2026-04-18",
        "end": "2026-05-08"
      },
      {
        "id": "rot_753",
        "type": "leave",
        "start": "2026-05-09",
        "end": "2026-05-22"
      },
      {
        "id": "rot_754",
        "type": "work",
        "start": "2026-05-23",
        "end": "2026-06-19"
      },
      {
        "id": "rot_755",
        "type": "leave",
        "start": "2026-06-20",
        "end": "2026-07-02"
      },
      {
        "id": "rot_756",
        "type": "work",
        "start": "2026-07-03",
        "end": "2026-07-22"
      },
      {
        "id": "rot_757",
        "type": "leave",
        "start": "2026-07-23",
        "end": "2026-08-19"
      }
    ]
  },
  {
    "ID": "1009",
    "Name": "Ibrahim Yaslem Al-Zubaidi",
    "Company": "PetroMasila-BLK53",
    "Department": "Operations",
    "Rotations": [
      {
        "id": "rot_758",
        "type": "work",
        "start": "2025-10-30",
        "end": "2025-11-19"
      },
      {
        "id": "rot_759",
        "type": "leave",
        "start": "2025-11-20",
        "end": "2025-12-10"
      },
      {
        "id": "rot_760",
        "type": "work",
        "start": "2025-12-11",
        "end": "2025-12-31"
      },
      {
        "id": "rot_761",
        "type": "leave",
        "start": "2026-01-01",
        "end": "2026-01-22"
      },
      {
        "id": "rot_762",
        "type": "work",
        "start": "2026-01-23",
        "end": "2026-02-13"
      },
      {
        "id": "rot_763",
        "type": "leave",
        "start": "2026-02-14",
        "end": "2026-03-13"
      },
      {
        "id": "rot_764",
        "type": "work",
        "start": "2026-03-14",
        "end": "2026-04-17"
      },
      {
        "id": "rot_765",
        "type": "leave",
        "start": "2026-04-18",
        "end": "2026-05-08"
      },
      {
        "id": "rot_766",
        "type": "work",
        "start": "2026-05-09",
        "end": "2026-05-22"
      },
      {
        "id": "rot_767",
        "type": "leave",
        "start": "2026-05-23",
        "end": "2026-06-12"
      },
      {
        "id": "rot_768",
        "type": "work",
        "start": "2026-06-13",
        "end": "2026-07-02"
      },
      {
        "id": "rot_769",
        "type": "leave",
        "start": "2026-07-03",
        "end": "2026-07-22"
      },
      {
        "id": "rot_770",
        "type": "work",
        "start": "2026-07-23",
        "end": "2026-08-19"
      },
      {
        "id": "rot_771",
        "type": "leave",
        "start": "2026-08-20",
        "end": "2026-09-16"
      }
    ]
  },
  {
    "ID": "278",
    "Name": "Shehab Salem Khames Balajam",
    "Company": "PetroMasila-BLK53",
    "Department": "Operations",
    "Rotations": [
      {
        "id": "rot_772",
        "type": "work",
        "start": "2025-10-16",
        "end": "2025-11-12"
      },
      {
        "id": "rot_773",
        "type": "leave",
        "start": "2025-11-13",
        "end": "2025-12-10"
      },
      {
        "id": "rot_774",
        "type": "work",
        "start": "2025-12-11",
        "end": "2026-01-07"
      },
      {
        "id": "rot_775",
        "type": "leave",
        "start": "2026-01-08",
        "end": "2026-02-04"
      },
      {
        "id": "rot_776",
        "type": "work",
        "start": "2026-02-05",
        "end": "2026-03-04"
      },
      {
        "id": "rot_777",
        "type": "leave",
        "start": "2026-03-05",
        "end": "2026-04-01"
      },
      {
        "id": "rot_778",
        "type": "work",
        "start": "2026-04-02",
        "end": "2026-04-29"
      },
      {
        "id": "rot_779",
        "type": "leave",
        "start": "2026-04-30",
        "end": "2026-05-20"
      },
      {
        "id": "rot_780",
        "type": "work",
        "start": "2026-05-21",
        "end": "2026-06-10"
      },
      {
        "id": "rot_781",
        "type": "leave",
        "start": "2026-06-11",
        "end": "2026-07-08"
      },
      {
        "id": "rot_782",
        "type": "work",
        "start": "2026-07-09",
        "end": "2026-08-05"
      },
      {
        "id": "rot_783",
        "type": "leave",
        "start": "2026-08-06",
        "end": "2026-09-02"
      },
      {
        "id": "rot_784",
        "type": "work",
        "start": "2026-09-03",
        "end": "2026-09-30"
      },
      {
        "id": "rot_785",
        "type": "leave",
        "start": "2026-10-01",
        "end": "2026-10-28"
      },
      {
        "id": "rot_786",
        "type": "work",
        "start": "2026-10-29",
        "end": "2026-11-25"
      },
      {
        "id": "rot_787",
        "type": "leave",
        "start": "2026-11-26",
        "end": "2026-12-23"
      },
      {
        "id": "rot_788",
        "type": "work",
        "start": "2026-12-24",
        "end": "2027-01-20"
      }
    ]
  },
  {
    "ID": "129",
    "Name": "Akram Awad Salem Salman",
    "Company": "PetroMasila-BLK53",
    "Department": "Operations",
    "Rotations": [
      {
        "id": "rot_789",
        "type": "work",
        "start": "2025-11-13",
        "end": "2025-12-10"
      },
      {
        "id": "rot_790",
        "type": "leave",
        "start": "2025-12-11",
        "end": "2026-01-07"
      },
      {
        "id": "rot_791",
        "type": "work",
        "start": "2026-01-08",
        "end": "2026-02-04"
      },
      {
        "id": "rot_792",
        "type": "leave",
        "start": "2026-02-05",
        "end": "2026-03-04"
      },
      {
        "id": "rot_793",
        "type": "work",
        "start": "2026-03-05",
        "end": "2026-04-01"
      },
      {
        "id": "rot_794",
        "type": "leave",
        "start": "2026-04-02",
        "end": "2026-04-29"
      },
      {
        "id": "rot_795",
        "type": "work",
        "start": "2026-04-30",
        "end": "2026-05-20"
      },
      {
        "id": "rot_796",
        "type": "leave",
        "start": "2026-05-21",
        "end": "2026-06-10"
      },
      {
        "id": "rot_797",
        "type": "work",
        "start": "2026-06-11",
        "end": "2026-07-08"
      },
      {
        "id": "rot_798",
        "type": "leave",
        "start": "2026-07-09",
        "end": "2026-08-05"
      },
      {
        "id": "rot_799",
        "type": "work",
        "start": "2026-08-06",
        "end": "2026-09-02"
      },
      {
        "id": "rot_800",
        "type": "leave",
        "start": "2026-09-03",
        "end": "2026-09-30"
      },
      {
        "id": "rot_801",
        "type": "work",
        "start": "2026-10-01",
        "end": "2026-10-28"
      },
      {
        "id": "rot_802",
        "type": "leave",
        "start": "2026-10-29",
        "end": "2026-11-25"
      },
      {
        "id": "rot_803",
        "type": "work",
        "start": "2026-11-26",
        "end": "2026-12-23"
      },
      {
        "id": "rot_804",
        "type": "leave",
        "start": "2026-12-24",
        "end": "2027-01-20"
      }
    ]
  },
  {
    "ID": "1019",
    "Name": "Zaid Naji Al-Jaberi",
    "Company": "PetroMasila - BLK53",
    "Department": "Operations",
    "Rotations": [
      {
        "id": "rot_805",
        "type": "work",
        "start": "2025-11-06",
        "end": "2025-12-05"
      },
      {
        "id": "rot_806",
        "type": "leave",
        "start": "2025-12-06",
        "end": "2026-01-04"
      },
      {
        "id": "rot_807",
        "type": "work",
        "start": "2026-01-05",
        "end": "2026-02-01"
      },
      {
        "id": "rot_808",
        "type": "leave",
        "start": "2026-02-02",
        "end": "2026-03-02"
      },
      {
        "id": "rot_809",
        "type": "work",
        "start": "2026-03-03",
        "end": "2026-03-25"
      },
      {
        "id": "rot_810",
        "type": "leave",
        "start": "2026-03-26",
        "end": "2026-04-20"
      },
      {
        "id": "rot_811",
        "type": "work",
        "start": "2026-04-21",
        "end": "2026-05-16"
      },
      {
        "id": "rot_812",
        "type": "leave",
        "start": "2026-05-17",
        "end": "2026-06-09"
      },
      {
        "id": "rot_813",
        "type": "work",
        "start": "2026-06-10",
        "end": "2026-07-01"
      },
      {
        "id": "rot_814",
        "type": "leave",
        "start": "2026-07-02",
        "end": "2026-07-22"
      },
      {
        "id": "rot_815",
        "type": "work",
        "start": "2026-07-23",
        "end": "2026-08-19"
      },
      {
        "id": "rot_816",
        "type": "leave",
        "start": "2026-08-20",
        "end": "2026-09-16"
      },
      {
        "id": "rot_817",
        "type": "work",
        "start": "2026-09-17",
        "end": "2026-10-14"
      },
      {
        "id": "rot_818",
        "type": "leave",
        "start": "2026-10-15",
        "end": "2026-11-11"
      },
      {
        "id": "rot_819",
        "type": "work",
        "start": "2026-11-12",
        "end": "2026-12-09"
      },
      {
        "id": "rot_820",
        "type": "leave",
        "start": "2026-12-10",
        "end": "2027-01-06"
      }
    ]
  },
  {
    "ID": "1010",
    "Name": "Nabile Hadi Al-Howaimel",
    "Company": "PetroMasila-BLK53",
    "Department": "Operations",
    "Rotations": [
      {
        "id": "rot_821",
        "type": "work",
        "start": "2025-10-05",
        "end": "2025-11-08"
      },
      {
        "id": "rot_822",
        "type": "leave",
        "start": "2025-11-09",
        "end": "2025-12-02"
      },
      {
        "id": "rot_823",
        "type": "work",
        "start": "2025-12-03",
        "end": "2026-01-07"
      },
      {
        "id": "rot_824",
        "type": "leave",
        "start": "2026-01-08",
        "end": "2026-01-27"
      },
      {
        "id": "rot_825",
        "type": "work",
        "start": "2026-01-28",
        "end": "2026-03-04"
      },
      {
        "id": "rot_826",
        "type": "leave",
        "start": "2026-03-05",
        "end": "2026-03-25"
      },
      {
        "id": "rot_827",
        "type": "work",
        "start": "2026-03-26",
        "end": "2026-04-22"
      },
      {
        "id": "rot_828",
        "type": "leave",
        "start": "2026-04-23",
        "end": "2026-05-09"
      },
      {
        "id": "rot_829",
        "type": "work",
        "start": "2026-05-10",
        "end": "2026-06-09"
      },
      {
        "id": "rot_830",
        "type": "leave",
        "start": "2026-06-10",
        "end": "2026-06-29"
      },
      {
        "id": "rot_831",
        "type": "work",
        "start": "2026-06-30",
        "end": "2026-07-27"
      },
      {
        "id": "rot_832",
        "type": "leave",
        "start": "2026-07-28",
        "end": "2026-08-16"
      },
      {
        "id": "rot_833",
        "type": "work",
        "start": "2026-08-17",
        "end": "2026-09-19"
      },
      {
        "id": "rot_834",
        "type": "leave",
        "start": "2026-09-20",
        "end": "2026-10-10"
      },
      {
        "id": "rot_835",
        "type": "work",
        "start": "2026-10-11",
        "end": "2026-11-14"
      }
    ]
  },
  {
    "ID": "184",
    "Name": "Adel Abdullah Rajab Bajuma'an",
    "Company": "PetroMasila-BLK53",
    "Department": "Operations",
    "Rotations": [
      {
        "id": "rot_836",
        "type": "work",
        "start": "2025-10-19",
        "end": "2025-11-15"
      },
      {
        "id": "rot_837",
        "type": "leave",
        "start": "2025-11-16",
        "end": "2025-12-15"
      },
      {
        "id": "rot_838",
        "type": "work",
        "start": "2025-12-16",
        "end": "2026-01-17"
      },
      {
        "id": "rot_839",
        "type": "leave",
        "start": "2026-01-18",
        "end": "2026-02-11"
      },
      {
        "id": "rot_840",
        "type": "work",
        "start": "2026-02-12",
        "end": "2026-02-27"
      },
      {
        "id": "rot_841",
        "type": "leave",
        "start": "2026-02-28",
        "end": "2026-03-29"
      },
      {
        "id": "rot_842",
        "type": "work",
        "start": "2026-03-30",
        "end": "2026-05-04"
      },
      {
        "id": "rot_843",
        "type": "leave",
        "start": "2026-05-05",
        "end": "2026-06-01"
      },
      {
        "id": "rot_844",
        "type": "work",
        "start": "2026-06-02",
        "end": "2026-06-29"
      },
      {
        "id": "rot_845",
        "type": "leave",
        "start": "2026-06-30",
        "end": "2026-07-25"
      },
      {
        "id": "rot_846",
        "type": "work",
        "start": "2026-07-26",
        "end": "2026-08-22"
      }
    ]
  },
  {
    "ID": "119",
    "Name": "Mohammed Salem Omar Bin Shamis",
    "Company": "PetroMasila-BLK53",
    "Department": "Operations",
    "Rotations": [
      {
        "id": "rot_847",
        "type": "work",
        "start": "2025-11-26",
        "end": "2025-12-23"
      },
      {
        "id": "rot_848",
        "type": "leave",
        "start": "2025-12-24",
        "end": "2026-01-20"
      },
      {
        "id": "rot_849",
        "type": "work",
        "start": "2026-01-21",
        "end": "2026-02-10"
      },
      {
        "id": "rot_850",
        "type": "leave",
        "start": "2026-02-11",
        "end": "2026-03-05"
      },
      {
        "id": "rot_851",
        "type": "work",
        "start": "2026-03-06",
        "end": "2026-03-28"
      },
      {
        "id": "rot_852",
        "type": "leave",
        "start": "2026-03-29",
        "end": "2026-04-18"
      },
      {
        "id": "rot_853",
        "type": "work",
        "start": "2026-04-19",
        "end": "2026-05-12"
      },
      {
        "id": "rot_854",
        "type": "leave",
        "start": "2026-05-13",
        "end": "2026-06-06"
      },
      {
        "id": "rot_855",
        "type": "work",
        "start": "2026-06-07",
        "end": "2026-07-04"
      },
      {
        "id": "rot_856",
        "type": "leave",
        "start": "2026-07-05",
        "end": "2026-08-01"
      },
      {
        "id": "rot_857",
        "type": "work",
        "start": "2026-08-02",
        "end": "2026-08-29"
      },
      {
        "id": "rot_858",
        "type": "leave",
        "start": "2026-08-30",
        "end": "2026-09-26"
      },
      {
        "id": "rot_859",
        "type": "work",
        "start": "2026-09-27",
        "end": "2026-10-24"
      },
      {
        "id": "rot_860",
        "type": "leave",
        "start": "2026-10-25",
        "end": "2026-11-21"
      },
      {
        "id": "rot_861",
        "type": "work",
        "start": "2026-11-22",
        "end": "2026-12-19"
      }
    ]
  },
  {
    "ID": "233",
    "Name": "Mutea Ali Karama Al-Huayml",
    "Company": "PetroMasila-BLK53",
    "Department": "Operations",
    "Rotations": [
      {
        "id": "rot_862",
        "type": "work",
        "start": "2025-10-26",
        "end": "2025-11-25"
      },
      {
        "id": "rot_863",
        "type": "leave",
        "start": "2025-11-26",
        "end": "2025-12-23"
      },
      {
        "id": "rot_864",
        "type": "work",
        "start": "2025-12-24",
        "end": "2026-01-20"
      },
      {
        "id": "rot_865",
        "type": "leave",
        "start": "2026-01-21",
        "end": "2026-02-10"
      },
      {
        "id": "rot_866",
        "type": "work",
        "start": "2026-02-11",
        "end": "2026-03-05"
      },
      {
        "id": "rot_867",
        "type": "leave",
        "start": "2026-03-06",
        "end": "2026-03-28"
      },
      {
        "id": "rot_868",
        "type": "work",
        "start": "2026-03-29",
        "end": "2026-04-18"
      },
      {
        "id": "rot_869",
        "type": "leave",
        "start": "2026-04-19",
        "end": "2026-05-12"
      },
      {
        "id": "rot_870",
        "type": "work",
        "start": "2026-05-13",
        "end": "2026-06-06"
      },
      {
        "id": "rot_871",
        "type": "leave",
        "start": "2026-06-07",
        "end": "2026-07-04"
      },
      {
        "id": "rot_872",
        "type": "work",
        "start": "2026-07-05",
        "end": "2026-08-01"
      },
      {
        "id": "rot_873",
        "type": "leave",
        "start": "2026-08-02",
        "end": "2026-08-29"
      },
      {
        "id": "rot_874",
        "type": "work",
        "start": "2026-08-30",
        "end": "2026-09-26"
      },
      {
        "id": "rot_875",
        "type": "leave",
        "start": "2026-09-27",
        "end": "2026-10-24"
      },
      {
        "id": "rot_876",
        "type": "work",
        "start": "2026-10-25",
        "end": "2026-11-21"
      },
      {
        "id": "rot_877",
        "type": "leave",
        "start": "2026-11-22",
        "end": "2026-12-19"
      },
      {
        "id": "rot_878",
        "type": "work",
        "start": "2026-12-20",
        "end": "2027-01-16"
      },
      {
        "id": "rot_879",
        "type": "leave",
        "start": "2027-01-17",
        "end": "2027-02-14"
      }
    ]
  },
  {
    "ID": "217",
    "Name": "Mohammed Omar Al-Tamemi",
    "Company": "PetroMasila-BLK53",
    "Department": "Operations",
    "B2B_Alternate": "247",
    "Rotations": [
      {
        "id": "rot_880",
        "type": "work",
        "start": "2025-11-08",
        "end": "2025-11-26"
      },
      {
        "id": "rot_881",
        "type": "leave",
        "start": "2025-11-27",
        "end": "2025-12-17"
      },
      {
        "id": "rot_882",
        "type": "work",
        "start": "2025-12-18",
        "end": "2026-01-14"
      },
      {
        "id": "rot_883",
        "type": "leave",
        "start": "2026-01-15",
        "end": "2026-01-28"
      },
      {
        "id": "rot_884",
        "type": "work",
        "start": "2026-01-29",
        "end": "2026-02-11"
      },
      {
        "id": "rot_885",
        "type": "leave",
        "start": "2026-02-12",
        "end": "2026-03-05"
      },
      {
        "id": "rot_886",
        "type": "work",
        "start": "2026-03-06",
        "end": "2026-04-01"
      },
      {
        "id": "rot_887",
        "type": "leave",
        "start": "2026-04-02",
        "end": "2026-04-29"
      },
      {
        "id": "rot_888",
        "type": "work",
        "start": "2026-04-30",
        "end": "2026-05-20"
      },
      {
        "id": "rot_889",
        "type": "leave",
        "start": "2026-05-21",
        "end": "2026-06-17"
      },
      {
        "id": "rot_890",
        "type": "work",
        "start": "2026-06-18",
        "end": "2026-07-11"
      },
      {
        "id": "rot_891",
        "type": "leave",
        "start": "2026-07-12",
        "end": "2026-08-05"
      },
      {
        "id": "rot_892",
        "type": "work",
        "start": "2026-08-06",
        "end": "2026-09-02"
      },
      {
        "id": "rot_893",
        "type": "leave",
        "start": "2026-09-03",
        "end": "2026-09-30"
      },
      {
        "id": "rot_894",
        "type": "work",
        "start": "2026-10-01",
        "end": "2026-10-28"
      },
      {
        "id": "rot_895",
        "type": "leave",
        "start": "2026-10-29",
        "end": "2026-11-25"
      },
      {
        "id": "rot_896",
        "type": "work",
        "start": "2026-11-26",
        "end": "2026-12-23"
      }
    ]
  },
  {
    "ID": "247",
    "Name": "Suleman Omar Al-Tamemi",
    "Company": "PetroMasila-BLK53",
    "Department": "Operations",
    "B2B_Alternate": "217",
    "Rotations": [
      {
        "id": "rot_897",
        "type": "work",
        "start": "2025-11-27",
        "end": "2025-12-17"
      },
      {
        "id": "rot_898",
        "type": "leave",
        "start": "2025-12-18",
        "end": "2026-01-14"
      },
      {
        "id": "rot_899",
        "type": "work",
        "start": "2026-01-15",
        "end": "2026-01-28"
      },
      {
        "id": "rot_900",
        "type": "leave",
        "start": "2026-01-29",
        "end": "2026-02-11"
      },
      {
        "id": "rot_901",
        "type": "work",
        "start": "2026-02-12",
        "end": "2026-03-05"
      },
      {
        "id": "rot_902",
        "type": "leave",
        "start": "2026-03-06",
        "end": "2026-04-01"
      },
      {
        "id": "rot_903",
        "type": "work",
        "start": "2026-04-02",
        "end": "2026-04-24"
      },
      {
        "id": "rot_904",
        "type": "leave",
        "start": "2026-04-25",
        "end": "2026-05-20"
      },
      {
        "id": "rot_905",
        "type": "work",
        "start": "2026-05-21",
        "end": "2026-06-17"
      },
      {
        "id": "rot_906",
        "type": "leave",
        "start": "2026-06-18",
        "end": "2026-07-11"
      },
      {
        "id": "rot_907",
        "type": "work",
        "start": "2026-07-12",
        "end": "2026-08-05"
      },
      {
        "id": "rot_908",
        "type": "leave",
        "start": "2026-08-06",
        "end": "2026-09-02"
      },
      {
        "id": "rot_909",
        "type": "work",
        "start": "2026-09-03",
        "end": "2026-09-30"
      },
      {
        "id": "rot_910",
        "type": "leave",
        "start": "2026-10-01",
        "end": "2026-10-28"
      },
      {
        "id": "rot_911",
        "type": "work",
        "start": "2026-10-29",
        "end": "2026-11-25"
      },
      {
        "id": "rot_912",
        "type": "leave",
        "start": "2026-11-26",
        "end": "2026-12-23"
      }
    ]
  },
  {
    "ID": "246",
    "Name": "Hasan Saeed Hasan Ba Wazeer",
    "Company": "PetroMasila-BLK53",
    "Department": "Operations",
    "Rotations": [
      {
        "id": "rot_913",
        "type": "work",
        "start": "2025-10-30",
        "end": "2025-11-19"
      },
      {
        "id": "rot_914",
        "type": "leave",
        "start": "2025-11-20",
        "end": "2025-12-10"
      },
      {
        "id": "rot_915",
        "type": "work",
        "start": "2025-12-11",
        "end": "2025-12-31"
      },
      {
        "id": "rot_916",
        "type": "leave",
        "start": "2026-01-01",
        "end": "2026-01-22"
      },
      {
        "id": "rot_917",
        "type": "work",
        "start": "2026-01-23",
        "end": "2026-02-13"
      },
      {
        "id": "rot_918",
        "type": "leave",
        "start": "2026-02-14",
        "end": "2026-03-06"
      },
      {
        "id": "rot_919",
        "type": "work",
        "start": "2026-03-07",
        "end": "2026-04-03"
      },
      {
        "id": "rot_920",
        "type": "leave",
        "start": "2026-04-04",
        "end": "2026-05-01"
      },
      {
        "id": "rot_921",
        "type": "work",
        "start": "2026-05-02",
        "end": "2026-05-22"
      },
      {
        "id": "rot_922",
        "type": "leave",
        "start": "2026-05-23",
        "end": "2026-06-12"
      },
      {
        "id": "rot_923",
        "type": "work",
        "start": "2026-06-13",
        "end": "2026-07-02"
      },
      {
        "id": "rot_924",
        "type": "leave",
        "start": "2026-07-03",
        "end": "2026-07-22"
      },
      {
        "id": "rot_925",
        "type": "work",
        "start": "2026-07-23",
        "end": "2026-08-19"
      },
      {
        "id": "rot_926",
        "type": "leave",
        "start": "2026-08-20",
        "end": "2026-09-16"
      },
      {
        "id": "rot_927",
        "type": "work",
        "start": "2026-09-17",
        "end": "2026-10-14"
      },
      {
        "id": "rot_928",
        "type": "leave",
        "start": "2026-10-15",
        "end": "2026-11-11"
      },
      {
        "id": "rot_929",
        "type": "work",
        "start": "2026-11-12",
        "end": "2026-12-09"
      }
    ]
  },
  {
    "ID": "149",
    "Name": "Hasan Mohssin Saeed AL-Zubidi",
    "Company": "PetroMasila-BLK53",
    "Department": "Operations",
    "Rotations": [
      {
        "id": "rot_930",
        "type": "work",
        "start": "2025-11-20",
        "end": "2025-12-10"
      },
      {
        "id": "rot_931",
        "type": "leave",
        "start": "2025-12-11",
        "end": "2025-12-31"
      },
      {
        "id": "rot_932",
        "type": "work",
        "start": "2026-01-01",
        "end": "2026-01-22"
      },
      {
        "id": "rot_933",
        "type": "leave",
        "start": "2026-01-23",
        "end": "2026-02-13"
      },
      {
        "id": "rot_934",
        "type": "work",
        "start": "2026-02-14",
        "end": "2026-03-06"
      },
      {
        "id": "rot_935",
        "type": "leave",
        "start": "2026-03-07",
        "end": "2026-04-03"
      },
      {
        "id": "rot_936",
        "type": "work",
        "start": "2026-04-04",
        "end": "2026-05-01"
      },
      {
        "id": "rot_937",
        "type": "leave",
        "start": "2026-05-02",
        "end": "2026-05-22"
      },
      {
        "id": "rot_938",
        "type": "work",
        "start": "2026-05-23",
        "end": "2026-06-12"
      },
      {
        "id": "rot_939",
        "type": "leave",
        "start": "2026-06-13",
        "end": "2026-07-02"
      },
      {
        "id": "rot_940",
        "type": "work",
        "start": "2026-07-03",
        "end": "2026-07-22"
      },
      {
        "id": "rot_941",
        "type": "leave",
        "start": "2026-07-23",
        "end": "2026-08-19"
      },
      {
        "id": "rot_942",
        "type": "work",
        "start": "2026-08-20",
        "end": "2026-09-16"
      },
      {
        "id": "rot_943",
        "type": "leave",
        "start": "2026-09-17",
        "end": "2026-10-14"
      },
      {
        "id": "rot_944",
        "type": "work",
        "start": "2026-10-15",
        "end": "2026-11-11"
      },
      {
        "id": "rot_945",
        "type": "leave",
        "start": "2026-11-12",
        "end": "2026-12-09"
      }
    ]
  },
  {
    "ID": "1011",
    "Name": "Magdi Yslem Abbad",
    "Company": "PetroMasila-BLK53",
    "Department": "Operations",
    "Rotations": [
      {
        "id": "rot_946",
        "type": "work",
        "start": "2025-11-30",
        "end": "2025-12-29"
      },
      {
        "id": "rot_947",
        "type": "leave",
        "start": "2025-12-30",
        "end": "2026-01-13"
      },
      {
        "id": "rot_948",
        "type": "work",
        "start": "2026-01-14",
        "end": "2026-02-12"
      },
      {
        "id": "rot_949",
        "type": "leave",
        "start": "2026-02-13",
        "end": "2026-02-27"
      },
      {
        "id": "rot_950",
        "type": "work",
        "start": "2026-02-28",
        "end": "2026-03-29"
      },
      {
        "id": "rot_951",
        "type": "leave",
        "start": "2026-03-30",
        "end": "2026-04-12"
      },
      {
        "id": "rot_952",
        "type": "work",
        "start": "2026-04-13",
        "end": "2026-05-10"
      },
      {
        "id": "rot_953",
        "type": "leave",
        "start": "2026-05-11",
        "end": "2026-05-24"
      },
      {
        "id": "rot_954",
        "type": "work",
        "start": "2026-05-25",
        "end": "2026-06-23"
      },
      {
        "id": "rot_955",
        "type": "leave",
        "start": "2026-06-24",
        "end": "2026-07-08"
      },
      {
        "id": "rot_956",
        "type": "work",
        "start": "2026-07-09",
        "end": "2026-08-05"
      },
      {
        "id": "rot_957",
        "type": "leave",
        "start": "2026-08-06",
        "end": "2026-08-19"
      },
      {
        "id": "rot_958",
        "type": "work",
        "start": "2026-08-20",
        "end": "2026-09-16"
      },
      {
        "id": "rot_959",
        "type": "leave",
        "start": "2026-09-17",
        "end": "2026-09-30"
      },
      {
        "id": "rot_960",
        "type": "work",
        "start": "2026-10-01",
        "end": "2026-10-28"
      },
      {
        "id": "rot_961",
        "type": "leave",
        "start": "2026-10-29",
        "end": "2026-11-11"
      },
      {
        "id": "rot_962",
        "type": "work",
        "start": "2026-11-12",
        "end": "2026-12-09"
      }
    ]
  },
  {
    "ID": "1012",
    "Name": "Reyad Hasan Al-Hassani",
    "Company": "PetroMasila-BLK53",
    "Department": "Operations",
    "Rotations": [
      {
        "id": "rot_963",
        "type": "work",
        "start": "2025-11-15",
        "end": "2025-12-14"
      },
      {
        "id": "rot_964",
        "type": "leave",
        "start": "2025-12-15",
        "end": "2025-12-29"
      },
      {
        "id": "rot_965",
        "type": "work",
        "start": "2025-12-30",
        "end": "2026-01-28"
      },
      {
        "id": "rot_966",
        "type": "leave",
        "start": "2026-01-29",
        "end": "2026-02-12"
      },
      {
        "id": "rot_967",
        "type": "work",
        "start": "2026-02-13",
        "end": "2026-03-13"
      },
      {
        "id": "rot_968",
        "type": "leave",
        "start": "2026-03-14",
        "end": "2026-03-29"
      },
      {
        "id": "rot_969",
        "type": "work",
        "start": "2026-03-30",
        "end": "2026-04-26"
      },
      {
        "id": "rot_970",
        "type": "leave",
        "start": "2026-04-27",
        "end": "2026-05-10"
      },
      {
        "id": "rot_971",
        "type": "work",
        "start": "2026-05-11",
        "end": "2026-06-08"
      },
      {
        "id": "rot_972",
        "type": "leave",
        "start": "2026-06-09",
        "end": "2026-06-23"
      },
      {
        "id": "rot_973",
        "type": "work",
        "start": "2026-06-24",
        "end": "2026-07-22"
      },
      {
        "id": "rot_974",
        "type": "leave",
        "start": "2026-07-23",
        "end": "2026-08-05"
      },
      {
        "id": "rot_975",
        "type": "work",
        "start": "2026-08-06",
        "end": "2026-09-02"
      },
      {
        "id": "rot_976",
        "type": "leave",
        "start": "2026-09-03",
        "end": "2026-09-16"
      },
      {
        "id": "rot_977",
        "type": "work",
        "start": "2026-09-17",
        "end": "2026-10-14"
      },
      {
        "id": "rot_978",
        "type": "leave",
        "start": "2026-10-15",
        "end": "2026-10-28"
      },
      {
        "id": "rot_979",
        "type": "work",
        "start": "2026-10-29",
        "end": "2026-11-25"
      }
    ]
  },
  {
    "ID": "1013",
    "Name": "AbdulRahim Mohseh AL-Awdi",
    "Company": "PetroMasila-BLK53",
    "Department": "Operations",
    "Rotations": [
      {
        "id": "rot_980",
        "type": "work",
        "start": "2025-10-30",
        "end": "2025-11-29"
      },
      {
        "id": "rot_981",
        "type": "leave",
        "start": "2025-11-30",
        "end": "2025-12-14"
      },
      {
        "id": "rot_982",
        "type": "work",
        "start": "2025-12-15",
        "end": "2026-01-13"
      },
      {
        "id": "rot_983",
        "type": "leave",
        "start": "2026-01-14",
        "end": "2026-01-28"
      },
      {
        "id": "rot_984",
        "type": "work",
        "start": "2026-01-29",
        "end": "2026-02-27"
      },
      {
        "id": "rot_985",
        "type": "leave",
        "start": "2026-02-28",
        "end": "2026-03-13"
      },
      {
        "id": "rot_986",
        "type": "work",
        "start": "2026-03-14",
        "end": "2026-04-12"
      },
      {
        "id": "rot_987",
        "type": "leave",
        "start": "2026-04-13",
        "end": "2026-04-26"
      },
      {
        "id": "rot_988",
        "type": "work",
        "start": "2026-04-27",
        "end": "2026-05-24"
      },
      {
        "id": "rot_989",
        "type": "leave",
        "start": "2026-05-25",
        "end": "2026-06-08"
      },
      {
        "id": "rot_990",
        "type": "work",
        "start": "2026-06-09",
        "end": "2026-07-08"
      },
      {
        "id": "rot_991",
        "type": "leave",
        "start": "2026-07-09",
        "end": "2026-07-22"
      },
      {
        "id": "rot_992",
        "type": "work",
        "start": "2026-07-23",
        "end": "2026-08-19"
      },
      {
        "id": "rot_993",
        "type": "leave",
        "start": "2026-08-20",
        "end": "2026-09-02"
      },
      {
        "id": "rot_994",
        "type": "work",
        "start": "2026-09-03",
        "end": "2026-09-30"
      },
      {
        "id": "rot_995",
        "type": "leave",
        "start": "2026-10-01",
        "end": "2026-10-14"
      },
      {
        "id": "rot_996",
        "type": "work",
        "start": "2026-10-15",
        "end": "2026-11-11"
      }
    ]
  },
  {
    "ID": "187",
    "Name": "Abdulateef Ahmed A.Kabeer Ba-Humaid",
    "Company": "PetroMasila-BLK53",
    "Department": "Operations",
    "Rotations": [
      {
        "id": "rot_997",
        "type": "work",
        "start": "2025-10-16",
        "end": "2025-11-10"
      },
      {
        "id": "rot_998",
        "type": "leave",
        "start": "2025-11-11",
        "end": "2025-12-06"
      },
      {
        "id": "rot_999",
        "type": "work",
        "start": "2025-12-07",
        "end": "2026-01-03"
      },
      {
        "id": "rot_1000",
        "type": "leave",
        "start": "2026-01-04",
        "end": "2026-01-24"
      },
      {
        "id": "rot_1001",
        "type": "work",
        "start": "2026-01-25",
        "end": "2026-02-20"
      },
      {
        "id": "rot_1002",
        "type": "leave",
        "start": "2026-02-21",
        "end": "2026-03-28"
      },
      {
        "id": "rot_1003",
        "type": "work",
        "start": "2026-03-29",
        "end": "2026-05-09"
      },
      {
        "id": "rot_1004",
        "type": "leave",
        "start": "2026-05-10",
        "end": "2026-05-30"
      },
      {
        "id": "rot_1005",
        "type": "work",
        "start": "2026-05-31",
        "end": "2026-06-23"
      },
      {
        "id": "rot_1006",
        "type": "leave",
        "start": "2026-06-24",
        "end": "2026-07-21"
      }
    ]
  },
  {
    "ID": "127",
    "Name": "Majed Gritas Musad Al-Ameri",
    "Company": "PetroMasila-BLK53",
    "Department": "Warehouse",
    "Rotations": [
      {
        "id": "rot_1007",
        "type": "work",
        "start": "2025-11-06",
        "end": "2025-12-05"
      },
      {
        "id": "rot_1008",
        "type": "leave",
        "start": "2025-12-06",
        "end": "2025-12-31"
      },
      {
        "id": "rot_1009",
        "type": "work",
        "start": "2026-01-01",
        "end": "2026-01-31"
      },
      {
        "id": "rot_1010",
        "type": "leave",
        "start": "2026-02-01",
        "end": "2026-03-03"
      },
      {
        "id": "rot_1011",
        "type": "work",
        "start": "2026-03-04",
        "end": "2026-03-31"
      },
      {
        "id": "rot_1012",
        "type": "leave",
        "start": "2026-04-01",
        "end": "2026-04-22"
      },
      {
        "id": "rot_1013",
        "type": "work",
        "start": "2026-04-23",
        "end": "2026-05-14"
      },
      {
        "id": "rot_1014",
        "type": "leave",
        "start": "2026-05-15",
        "end": "2026-06-12"
      },
      {
        "id": "rot_1015",
        "type": "work",
        "start": "2026-06-13",
        "end": "2026-06-14"
      },
      {
        "id": "rot_1016",
        "type": "leave",
        "start": "2026-06-15",
        "end": "2026-06-15"
      },
      {
        "id": "rot_1017",
        "type": "work",
        "start": "2026-06-16",
        "end": "2026-07-11"
      }
    ]
  },
  {
    "ID": "69",
    "Name": "Mohmmed Awadh Mabrok Al-Saadi",
    "Company": "PetroMasila-BLK53",
    "Department": "Warehouse",
    "Rotations": [
      {
        "id": "rot_1018",
        "type": "work",
        "start": "2025-10-09",
        "end": "2025-11-05"
      },
      {
        "id": "rot_1019",
        "type": "leave",
        "start": "2025-11-06",
        "end": "2025-12-03"
      },
      {
        "id": "rot_1020",
        "type": "work",
        "start": "2025-12-04",
        "end": "2025-12-31"
      },
      {
        "id": "rot_1021",
        "type": "leave",
        "start": "2026-01-01",
        "end": "2026-01-31"
      },
      {
        "id": "rot_1022",
        "type": "work",
        "start": "2026-02-01",
        "end": "2026-03-03"
      },
      {
        "id": "rot_1023",
        "type": "leave",
        "start": "2026-03-04",
        "end": "2026-03-31"
      },
      {
        "id": "rot_1024",
        "type": "work",
        "start": "2026-04-01",
        "end": "2026-04-22"
      },
      {
        "id": "rot_1025",
        "type": "leave",
        "start": "2026-04-23",
        "end": "2026-05-14"
      },
      {
        "id": "rot_1026",
        "type": "work",
        "start": "2026-05-15",
        "end": "2026-06-12"
      },
      {
        "id": "rot_1027",
        "type": "leave",
        "start": "2026-06-13",
        "end": "2026-07-10"
      }
    ]
  },
  {
    "ID": "131",
    "Name": "Suliman Salem Omar Al-Ameri",
    "Company": "PetroMasila-BLK53",
    "Department": "Warehouse",
    "Rotations": [
      {
        "id": "rot_1028",
        "type": "work",
        "start": "2025-10-16",
        "end": "2025-11-12"
      },
      {
        "id": "rot_1029",
        "type": "leave",
        "start": "2025-11-13",
        "end": "2025-12-02"
      },
      {
        "id": "rot_1030",
        "type": "work",
        "start": "2025-12-03",
        "end": "2025-12-22"
      },
      {
        "id": "rot_1031",
        "type": "leave",
        "start": "2025-12-23",
        "end": "2026-01-26"
      },
      {
        "id": "rot_1032",
        "type": "work",
        "start": "2026-01-27",
        "end": "2026-03-02"
      },
      {
        "id": "rot_1033",
        "type": "leave",
        "start": "2026-03-03",
        "end": "2026-03-30"
      },
      {
        "id": "rot_1034",
        "type": "work",
        "start": "2026-03-31",
        "end": "2026-04-27"
      },
      {
        "id": "rot_1035",
        "type": "leave",
        "start": "2026-04-28",
        "end": "2026-05-18"
      },
      {
        "id": "rot_1036",
        "type": "work",
        "start": "2026-05-19",
        "end": "2026-06-08"
      },
      {
        "id": "rot_1037",
        "type": "leave",
        "start": "2026-06-09",
        "end": "2026-07-06"
      },
      {
        "id": "rot_1038",
        "type": "work",
        "start": "2026-07-07",
        "end": "2026-08-03"
      }
    ]
  },
  {
    "ID": "1014",
    "Name": "Hashem Yeslam Bakheet",
    "Company": "PetroMasila-BLK53",
    "Department": "Warehouse",
    "Rotations": [
      {
        "id": "rot_1039",
        "type": "work",
        "start": "2025-11-13",
        "end": "2025-12-02"
      },
      {
        "id": "rot_1040",
        "type": "leave",
        "start": "2025-12-03",
        "end": "2025-12-22"
      },
      {
        "id": "rot_1041",
        "type": "work",
        "start": "2025-12-23",
        "end": "2026-01-26"
      },
      {
        "id": "rot_1042",
        "type": "leave",
        "start": "2026-01-27",
        "end": "2026-03-02"
      },
      {
        "id": "rot_1043",
        "type": "work",
        "start": "2026-03-03",
        "end": "2026-03-30"
      },
      {
        "id": "rot_1044",
        "type": "leave",
        "start": "2026-03-31",
        "end": "2026-04-27"
      },
      {
        "id": "rot_1045",
        "type": "work",
        "start": "2026-04-28",
        "end": "2026-05-18"
      },
      {
        "id": "rot_1046",
        "type": "leave",
        "start": "2026-05-19",
        "end": "2026-06-08"
      },
      {
        "id": "rot_1047",
        "type": "work",
        "start": "2026-06-09",
        "end": "2026-06-27"
      },
      {
        "id": "rot_1048",
        "type": "leave",
        "start": "2026-06-28",
        "end": "2026-06-30"
      },
      {
        "id": "rot_1049",
        "type": "work",
        "start": "2026-07-01",
        "end": "2026-07-06"
      }
    ]
  },
  {
    "ID": "103",
    "Name": "Eissa Saeed Omar Ba Abaad",
    "Company": "PetroMasila-BLK53",
    "Department": "HSE",
    "Rotations": [
      {
        "id": "rot_1050",
        "type": "work",
        "start": "2025-10-13",
        "end": "2025-11-09"
      },
      {
        "id": "rot_1051",
        "type": "leave",
        "start": "2025-11-10",
        "end": "2025-12-07"
      },
      {
        "id": "rot_1052",
        "type": "work",
        "start": "2025-12-08",
        "end": "2026-01-04"
      },
      {
        "id": "rot_1053",
        "type": "leave",
        "start": "2026-01-05",
        "end": "2026-02-01"
      },
      {
        "id": "rot_1054",
        "type": "work",
        "start": "2026-03-30",
        "end": "2026-04-19"
      },
      {
        "id": "rot_1055",
        "type": "leave",
        "start": "2026-04-20",
        "end": "2026-05-10"
      },
      {
        "id": "rot_1056",
        "type": "work",
        "start": "2026-05-11",
        "end": "2026-06-07"
      },
      {
        "id": "rot_1057",
        "type": "leave",
        "start": "2026-06-08",
        "end": "2026-07-05"
      },
      {
        "id": "rot_1058",
        "type": "work",
        "start": "2026-07-06",
        "end": "2026-08-02"
      },
      {
        "id": "rot_1059",
        "type": "leave",
        "start": "2026-08-03",
        "end": "2026-08-30"
      },
      {
        "id": "rot_1060",
        "type": "work",
        "start": "2026-08-31",
        "end": "2026-09-27"
      },
      {
        "id": "rot_1061",
        "type": "leave",
        "start": "2026-09-28",
        "end": "2026-10-25"
      }
    ]
  },
  {
    "ID": "1015",
    "Name": "DR.Ali Saud Al-Jaberi",
    "Company": "PetroMasila-BLK53",
    "Department": "HSE",
    "Rotations": [
      {
        "id": "rot_1062",
        "type": "work",
        "start": "2025-11-10",
        "end": "2025-12-07"
      },
      {
        "id": "rot_1063",
        "type": "leave",
        "start": "2025-12-08",
        "end": "2026-01-04"
      },
      {
        "id": "rot_1064",
        "type": "work",
        "start": "2026-01-05",
        "end": "2026-02-08"
      },
      {
        "id": "rot_1065",
        "type": "leave",
        "start": "2026-02-09",
        "end": "2026-03-01"
      },
      {
        "id": "rot_1066",
        "type": "work",
        "start": "2026-03-02",
        "end": "2026-03-29"
      },
      {
        "id": "rot_1067",
        "type": "leave",
        "start": "2026-03-30",
        "end": "2026-04-19"
      },
      {
        "id": "rot_1068",
        "type": "work",
        "start": "2026-04-20",
        "end": "2026-05-10"
      },
      {
        "id": "rot_1069",
        "type": "leave",
        "start": "2026-05-11",
        "end": "2026-06-07"
      },
      {
        "id": "rot_1070",
        "type": "work",
        "start": "2026-06-08",
        "end": "2026-07-05"
      },
      {
        "id": "rot_1071",
        "type": "leave",
        "start": "2026-07-06",
        "end": "2026-08-02"
      },
      {
        "id": "rot_1072",
        "type": "work",
        "start": "2026-08-03",
        "end": "2026-08-30"
      },
      {
        "id": "rot_1073",
        "type": "leave",
        "start": "2026-08-31",
        "end": "2026-09-27"
      },
      {
        "id": "rot_1074",
        "type": "work",
        "start": "2026-09-28",
        "end": "2026-10-25"
      }
    ]
  },
  {
    "ID": "1016",
    "Name": "Dr.Naweer Salem Bakhamis",
    "Company": "PetroMasila-BLK53",
    "Department": "HSE",
    "Rotations": [
      {
        "id": "rot_1075",
        "type": "work",
        "start": "2025-10-13",
        "end": "2025-11-09"
      },
      {
        "id": "rot_1076",
        "type": "leave",
        "start": "2025-11-10",
        "end": "2025-12-07"
      },
      {
        "id": "rot_1077",
        "type": "work",
        "start": "2025-12-08",
        "end": "2026-01-17"
      },
      {
        "id": "rot_1078",
        "type": "leave",
        "start": "2026-01-18",
        "end": "2026-02-08"
      },
      {
        "id": "rot_1079",
        "type": "work",
        "start": "2026-02-09",
        "end": "2026-03-01"
      },
      {
        "id": "rot_1080",
        "type": "leave",
        "start": "2026-03-02",
        "end": "2026-03-29"
      },
      {
        "id": "rot_1081",
        "type": "work",
        "start": "2026-03-30",
        "end": "2026-04-19"
      },
      {
        "id": "rot_1082",
        "type": "leave",
        "start": "2026-04-20",
        "end": "2026-05-10"
      },
      {
        "id": "rot_1083",
        "type": "work",
        "start": "2026-05-11",
        "end": "2026-06-07"
      },
      {
        "id": "rot_1084",
        "type": "leave",
        "start": "2026-06-08",
        "end": "2026-07-05"
      },
      {
        "id": "rot_1085",
        "type": "work",
        "start": "2026-07-06",
        "end": "2026-08-02"
      },
      {
        "id": "rot_1086",
        "type": "leave",
        "start": "2026-08-03",
        "end": "2026-08-30"
      },
      {
        "id": "rot_1087",
        "type": "work",
        "start": "2026-08-31",
        "end": "2026-09-27"
      },
      {
        "id": "rot_1088",
        "type": "leave",
        "start": "2026-09-28",
        "end": "2026-10-25"
      }
    ]
  },
  {
    "ID": "1016",
    "Name": "DR.Mohammed Ahmed Bin-Daweel",
    "Company": "PetroMasila-BLK53",
    "Department": "HSE",
    "Rotations": [
      {
        "id": "rot_1089",
        "type": "work",
        "start": "2026-05-19",
        "end": "2026-06-22"
      },
      {
        "id": "rot_1090",
        "type": "leave",
        "start": "2026-06-23",
        "end": "2026-06-29"
      }
    ]
  }
];

window.EMPLOYEE_DATA = EMPLOYEE_DATA;