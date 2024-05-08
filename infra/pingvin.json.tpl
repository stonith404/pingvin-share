[
  {
    "name": "pingvin",
    "image": "stonith404/pingvin-share",
    "cpu": 0,
    "memory": 1024,
    "essential": true,
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "${awslogs_group}",
        "awslogs-region": "${region}",
        "awslogs-stream-prefix": "ecs",
        "awslogs-create-group": "true"
      }
    },
    "portMappings": [
      {
        "containerPort": 3000,
        "hostPort": 0
      }
    ],
    "mountPoints": [
        {
            "sourceVolume": "service-storage",
            "containerPath": "/tmp/data"
        }
    ],
    "environment": [
        {
            "name": "DATA_DIRECTORY",
            "value": "/tmp/data"
        },
        {
            "name": "DATABASE_URL",
            "value": "/tmp/data/pingvin-share.db?connection_limit=3"
        }
    ]
  }
]